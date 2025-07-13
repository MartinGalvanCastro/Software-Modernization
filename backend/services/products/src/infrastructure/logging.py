import logging


def setup_logging() -> None:
    logging.basicConfig(
        level="INFO", format="%(levelname)s:     %(message)s"
    )
