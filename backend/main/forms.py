from django import forms
from django.contrib.auth.models import User


class UserCreationForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'email')

    error_messages = {
        'password_mismatch': "The two password fields didn't match.",
    }

    username = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }))

    email = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }))

    password1 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
            }))

    password2 = forms.CharField(
        required=True,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
            }))

    def clean_password2(self):
            password1 = self.cleaned_data.get('password1', None)
            password2 = self.cleaned_data.get('password2', None)
            if password1 and password2 and password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch'
                )

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user
