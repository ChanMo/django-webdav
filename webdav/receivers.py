from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Activity, Comment
from .signals import upload_file_done, mv_file_done


@receiver(mv_file_done)
def add_mv_file_activity(sender, origin=None, destination=None, user=None, **kwargs):
    Activity.objects.create(
        resource=destination,
        user=user,
        action='mv'
    )

@receiver(mv_file_done)
def update_resource(sender, origin=None, destination=None, **kwargs):
    # update comments, activity, sharelink
    Activity.objects.filter(resource=origin).update(resource=destination)
    Comment.objects.filter(resource=origin).update(resource=destination)
    

@receiver(upload_file_done)
def add_upload_file_activity(sender, resource, user, **kwargs):
    Activity.objects.create(
        resource=resource,
        user=user,
        action='upload_file'
    )


@receiver(post_save, sender=Comment)
def add_comment_activity(sender, instance=None, created=False, **kwargs):
    if created:
        Activity.objects.create(
            resource=instance.resource,
            user=instance.user,
            action='comment'
        )
