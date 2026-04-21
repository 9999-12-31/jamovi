
from .utils import conf


class AttrDict(dict):
    __getattr__ = dict.__getitem__


class Permissions:

    _perms = None

    @staticmethod
    def retrieve():
        if Permissions._perms is not None:
            return Permissions._perms

        perms = Permissions()
        perms.setup()
        Permissions._perms = perms
        return perms

    def setup(self):
        app_mode = conf.get('mode', 'normal')
        if app_mode == 'normal':
            self.library.browseable = conf.get('permissions_library_browseable', '1') == '1'
            self.library.addRemove = conf.get('permissions_library_add_remove', '1') == '1'
            self.library.showHide = conf.get('permissions_library_show_hide', '1') == '1'
            self.library.sideLoad = conf.get('permissions_library_side_load', '1') == '1'
            self.browse.local = conf.get('permissions_browse_local', '1') == '1'
            self.browse.examples = conf.get('permissions_browse_examples', '1') == '1'
            self.open.local = conf.get('permissions_open_local', '1') == '1'
            self.open.upload = conf.get('permissions_open_upload', '1') == '1'
            self.open.remote = conf.get('permissions_open_remote', '1') == '1'
            self.open.examples = conf.get('permissions_open_examples', '1') == '1'
            self.save.local = conf.get('permissions_save_local', '1') == '1'
            self.save.download = conf.get('permissions_save_download', '1') == '1'
        elif app_mode == 'cloud':
            self.library.browseable = conf.get('permissions_library_browseable', '0') == '1'
            self.library.addRemove = conf.get('permissions_library_add_remove', '0') == '1'
            self.library.showHide = conf.get('permissions_library_show_hide', '0') == '1'
            self.library.sideLoad = False
            self.browse.local = False
            self.browse.examples = True
            self.open.local = False
            self.open.upload = True
            self.open.remote = True
            self.open.examples = True
            self.save.local = False
            self.save.download = True
            self.dataset.maxRows = int(conf.get('permissions_max_rows', '10000'))
            self.dataset.maxColumns = int(conf.get('permissions_max_columns', '100'))

    def __init__(self):
        self.library = AttrDict({
            'browseable': False,
            'addRemove': False,
            'showHide': False,
        })

        self.browse = AttrDict({
            'local': False,
            'examples': False,
        })

        self.open = AttrDict({
            'local': False,
            'examples': False,
            'upload': False,
        })

        self.save = AttrDict({
            'local': False,
            'download': False
        })

        self.dataset = AttrDict({
            'maxRows': float('inf'),
            'maxColumns': float('inf'),
        })
