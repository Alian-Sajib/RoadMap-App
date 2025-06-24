from django.urls import path
from rest_framework import routers
from .views import ProductItemsViewset, CommentViewSet

router = routers.SimpleRouter()
router.register(r"items", ProductItemsViewset, basename="items")
router.register(r"comments", CommentViewSet, basename="comment")

urlpatterns = [
    path("upvote/<int:pk>/", ProductItemsViewset.upvote_item),
] + router.urls
