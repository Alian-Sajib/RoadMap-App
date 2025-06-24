from django.shortcuts import render
from .serializers import ProductItemsSerializers, CommentSerializer
from .models import ProductItems, Upvote, Comment
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# Create your views here.


class ProductItemsViewset(viewsets.ModelViewSet):
    queryset = ProductItems.objects.all()
    serializer_class = ProductItemsSerializers
    permission_classes = [IsAuthenticated]

    @api_view(["POST"])
    def upvote_item(request, pk):
        user = request.user
        try:
            item = ProductItems.objects.get(pk=pk)
        except ProductItems.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        upvote, created = Upvote.objects.get_or_create(user=user, item=item)

        if created:
            # Just added upvote
            item.upvotes += 1
            item.save()
            return Response({"message": "Upvoted", "upvotes": item.upvotes})
        else:
            # Already upvoted before → remove
            upvote.delete()
            item.upvotes = max(0, item.upvotes - 1)
            item.save()
            return Response({"message": "Upvote removed", "upvotes": item.upvotes})


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == "list":
            item_id = self.request.query_params.get("item")
            return Comment.objects.filter(item_id=item_id).order_by("-created_at")
        return Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this comment.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this comment.")
        instance.delete()
