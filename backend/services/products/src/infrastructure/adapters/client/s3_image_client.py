import boto3
from botocore.exceptions import BotoCoreError, ClientError
from src.domain.ports import ImageClientPort
from config import settings

class S3ImageClient(ImageClientPort):
    """
    Adapter for uploading images to AWS S3.
    Implements ImageClientPort.
    """
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.region_name = settings.AWS_REGION
        self.s3_client = boto3.client(
            "s3",
            region_name=self.region_name
        )

    def upload_image(self, file_obj, filename: str, content_type: str) -> str:
        """
        Uploads an image file to S3 and returns its public URL.
        """
        try:
            self.s3_client.upload_fileobj(
                Fileobj=file_obj,
                Bucket=self.bucket_name,
                Key=filename,
                ExtraArgs={"ContentType": content_type, "ACL": "public-read"}
            )
            url = f"https://{self.bucket_name}.s3.{self.region_name}.amazonaws.com/{filename}"
            return url
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Failed to upload image to S3: {e}")
