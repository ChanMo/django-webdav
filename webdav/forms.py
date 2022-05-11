from django import forms


class ShareAuthForm(forms.Form):
    password = forms.CharField(
        label='密码',
        widget=forms.widgets.PasswordInput
    )
