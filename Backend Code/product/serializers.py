from rest_framework import serializers
from .models import ProductItems, Comment


class ProductItemsSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProductItems
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
