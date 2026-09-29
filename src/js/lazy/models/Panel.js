Ext.define('Tualo.timetracker.lazy.models.Panel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.timetracker',
    data: {
        record: null,
        hasRecord: false,
        sexagesimalformat: '01:00'
    },
    formulas: {
        canEdit: function (get) {
            return get('hasRecord') !== false;
        }
    },
    stores: {
        zeiterfassung: {
            type: 'zeiterfassung_store',
            autoLoad: false,
            autoSync: false,
            pageSize: 100000
        }
    }
});