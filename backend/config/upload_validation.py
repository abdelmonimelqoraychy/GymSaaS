from rest_framework import serializers


MAX_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_IMAGE_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def validate_image_upload(image):
    """Refuse les images trop volumineuses ou d'un type inattendu."""
    if image.size > MAX_IMAGE_SIZE:
        raise serializers.ValidationError(
            "L’image ne doit pas dépasser 5 Mo."
        )

    content_type = getattr(image, "content_type", None)

    if (
        content_type
        and content_type not in ALLOWED_IMAGE_CONTENT_TYPES
    ):
        raise serializers.ValidationError(
            "Utilisez une image JPEG, PNG ou WebP."
        )

    return image
