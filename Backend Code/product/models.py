from django.db import models
from authentication.models import User


# Create your models here.
class ProductItems(models.Model):
    STATUS = [("1", "In Progress"), ("2", "In Review"), ("3", "Completed")]

    title = models.CharField(max_length=250)
    description = models.TextField(max_length=400)
    status = models.CharField(max_length=50, choices=STATUS, default="1")
    upvotes = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Product Items"

    def __str__(self):
        return self.title


class Upvote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(ProductItems, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["user", "item"]


class Comment(models.Model):
    item = models.ForeignKey(
        ProductItems, related_name="comments", on_delete=models.CASCADE
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
