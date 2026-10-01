Ext.define('Tualo.timetracker.lazy.models.Panel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.timetracker',
    data: {
        record: null,
        currentDate: new Date(),
        hasRecord: false,
        mitarbeiter_id: null,
        sexagesimalformat: '01:00'
    },
    formulas: {
        disabled: function (get) {
            return Ext.isEmpty(get('mitarbeiter_id'));
        },
        canEdit: function (get) {
            return get('hasRecord') !== false;
        }
    },
    stores: {
        kalender: {
            type: 'zeiterfassung_store',
            autoLoad: false,
            autoSync: false,
            pageSize: 100000,
            listeners: {
                beforeload: 'onZeiterfassungPickerBeforeLoad'
            }
        },
        zeiterfassung: {
            type: 'zeiterfassung_store',
            autoLoad: false,
            autoSync: false,
            pageSize: 100000,
            listeners: {
                beforeload: 'onZeiterfassungBeforeLoad'
            }
        },

        tualo_job: {
            type: 'tualo_job_store',
            autoLoad: true,
            autoSync: false,
            pageSize: 100000,
            listeners: {
                beforeload: 'onJobBeforeLoad'
            }
        },
        mitarbeiter: {
            type: 'mitarbeiter_store',
            autoLoad: false,
            autoSync: false,
            pageSize: 100000,
            listeners: {
                beforeload: 'onMitarbeiterBeforeLoad'
            }
        }
    }
});