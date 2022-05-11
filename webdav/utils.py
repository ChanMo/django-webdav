def build_uri(uri, request=None, kwargs=None):
    pk = kwargs.get('pk')
    return f'/{pk}{uri}'.replace('//', '/')
