from django_filters import rest_framework as filters
from .models import Activity


class ActivityFilter(filters.FilterSet):
    class Meta:
        model = Activity
        fields = ['resource']

    @property
    def qs(self):
        parent = super().qs
