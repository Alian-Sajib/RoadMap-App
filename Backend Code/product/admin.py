from django.contrib import admin
from .models import ProductItems, Upvote, Comment

# Register your models here.

admin.site.register(ProductItems)
admin.site.register(Upvote)
admin.site.register(Comment)
