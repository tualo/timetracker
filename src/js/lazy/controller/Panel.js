Ext.define('Tualo.timetracker.lazy.controller.Panel', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timetracker',
    requires: [
        'Ext.util.KeyMap'
    ],

    onBoxReady: function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onBoxReady');
        let me = this;
        /*
        if (!me.keyMap) {
            me.keyMap = new Ext.util.KeyMap({
                target: me.getView().getEl(),
                ignoreInputFields: false,
                binding: [{
                    key: 'n',
                    ctrl: true,
                    shift: false,
                    alt: false,
                    handler: me.onNewShortcut,
                    scope: me
                }, {
                    key: 's',
                    ctrl: true,
                    shift: false,
                    alt: false,
                    handler: me.onSaveShortcut,
                    scope: me
                }]
            });
        }*/
        let async_fn = async () => {
            console.log('Tualo.timetracker.lazy.controller.Panel', 'onBoxReady.async_fn');
            let res = await me.currentStaffId();
            console.log('current staff id', res);
            if (res == 9999999) {
                Ext.toast({
                    html: 'Ihrem Login ist noch kein Mitarbeiter zugeordnet',
                    title: 'Fehler',
                    align: 't',
                    iconCls: 'fa fa-warning'
                });
            }
            console.log('current staff id loaded', res);
        };
        async_fn();
    },

    onNewShortcut: function (key, event) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onNewShortcut', key, event);
        event.stopEvent();
        if (!this.getView().isDisabled()) {
            this.onNew();
        }
    },

    onSaveShortcut: function (key, event) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onSaveShortcut', key, event);
        event.stopEvent();
        if (!this.getView().isDisabled() && this.getViewModel().get('hasRecord')) {
            this.onSave();
        }
    },

    destroy: function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'destroy');
        this.keyMap = Ext.destroy(this.keyMap);
        this.callParent(arguments);
    },

    initViewModel: function (vm) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'initViewModel', vm);
        vm.bind('{selectedEntry}', 'onSelect', this);
    },

    onBeforefilter: function (filters) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onBeforefilter', filters);
        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) {
            console.log('onBeforefilter', 'aborted')
            return false;
        }
        filters.add({
            'id': 'mitarbeiter_id',
            property: 'mitarbeiter_id',
            operator: 'eq',
            value: this.getViewModel().get('mitarbeiter_id')
        });
        return true;
    },
    onZeiterfassungPickerBeforeLoad: function (store, operation, eOpts) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onZeiterfassungPickerBeforeLoad', store, operation, eOpts);
        let extraParams = store.getProxy().getExtraParams(),
            filters = store.getFilters();
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };

        /*
        filters.add({
            'id': 'mitarbeiter_id',
            property: 'id',
            operator: 'eq',
            value: this.getViewModel().get('mitarbeiter_id')
        });
        */

        //store.setFilters(filters);

        console.log(filters, extraParams);

        //extraParams.filter = Ext.JSON.encode(filters);
        //store.getProxy().setExtraParams(extraParams);
    },
    onZeiterfassungBeforeLoad: function (store, operation, eOpts) {
        let me = this;
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onZeiterfassungBeforeLoad', store, operation, eOpts);
        let extraParams = store.getProxy().getExtraParams(),
            filters = [];
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };
        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) return false;
        if (me._preventReload === true) {
            console.log('Tualo.timetracker.lazy.controller.Panel', 'onZeiterfassungBeforeLoad', 'preventReload:', me._preventReload);
            return false;
        }
        filters.push({
            property: 'mitarbeiter_id',
            operator: 'eq',
            value: this.getViewModel().get('mitarbeiter_id')
        });


        filters.push({
            property: 'task_date',
            operator: 'eq',
            value: this.getViewModel().get('currentDate')
        });


        extraParams.filter = Ext.JSON.encode(filters);
        store.getProxy().setExtraParams(extraParams);
    },
    onZeiterfassungLoad: function (store, records, successful, eOpts) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onZeiterfassungLoad', store, records, successful, eOpts);
        let me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            grid = view.down('dslist_zeiterfassung');
        if (records && records.length > 0) {
            grid.setSelection(records[0]);
        } else {
            grid.setSelection(null);
        }

    },
    onMitarbeiterBeforeLoad: function (store, operation, eOpts) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onMitarbeiterBeforeLoad', store, operation, eOpts);
        let extraParams = store.getProxy().getExtraParams(),
            filters = [];
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };

        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) return false;
        let filterList = this.getViewModel().get('organigramm_mitarbeiter');
        filterList.push(this.getViewModel().get('user_login'));
        filters.push({
            property: 'user_login',
            operator: 'in',
            value: filterList
        });

        extraParams.filter = Ext.JSON.encode(filters);
        store.getProxy().setExtraParams(extraParams);
    },
    onJobBeforeLoad: function (store, operation, eOpts) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onJobBeforeLoad', store, operation, eOpts);
        let extraParams = store.getProxy().getExtraParams(),
            filters = [];
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };

        filters.push({
            property: 'status',
            operator: 'in',
            value: [1, 2, 3, 4]
        })
        extraParams.filter = Ext.JSON.encode(filters);
        store.getProxy().setExtraParams(extraParams);

        console.log('onJobBeforeLoad beforeload', operation);
    },
    onHourChange: function (mex, nv, ov) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onHourChange', mex, nv, ov);
        let me = this,
            vm = me.getViewModel(),
            record = vm.get('record');
        if (nv && record && !me.updatingTime) {
            if (nv.getHours() * 60 + nv.getMinutes() === Math.round(record.get('hours') * 60)) {
                return;
            }

            let minutes = nv.getHours() * 60 + nv.getMinutes(),
                stop = new Date(),
                start = new Date(stop.getTime() - minutes * 60000);
            stop.setSeconds(0, 0);
            start.setSeconds(0, 0);
            me.updatingTime = true;
            try {
                vm.set('record.task_start', start);
                vm.set('record.task_end', stop);
                vm.set('record.hours', minutes / 60);
                vm.notify();
            } finally {
                me.updatingTime = false;
            }
        }
    },
    onRangeChange: function (field, value) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onRangeChange', field, value);
        let me = this,
            vm = me.getViewModel(),
            fieldName = field.getName(),
            recordField = fieldName === 'range_start' ? 'task_start' :
                (fieldName === 'range_stop' ? 'task_end' : null);
        if (me.updatingTime || !recordField) {
            return;
        }
        me.updatingTime = true;
        try {
            vm.set('record.' + recordField, value);
            let start = vm.get('record.task_start'),
                stop = vm.get('record.task_end');
            if (!Ext.isDate(start) || !Ext.isDate(stop)) {
                return;
            }
            let minutes = ((stop.getHours() * 60 + stop.getMinutes()) -
                (start.getHours() * 60 + start.getMinutes()) + 1440) % 1440;
            vm.set('record.hours', minutes / 60);
            vm.set('sexagesimalformat', Ext.String.leftPad(Math.floor(minutes / 60), 2, '0') + ':' +
                Ext.String.leftPad(minutes % 60, 2, '0'));
            vm.notify();
        } finally {
            me.updatingTime = false;
        }
    },
    onSelect: function (selection) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onSelect', selection);
        let me = this,
            vm = me.getViewModel(),
            updatingTime = me.updatingTime;

        me.updatingTime = true;
        try {
            vm.set('isNew', false);

            console.log('onSelect', selection);
            if (Ext.isEmpty(selection)) {
                vm.set('hasRecord', false);
            } else {
                vm.set('record', selection);

                let minutes = Math.round(selection.get('hours') * 60),
                    h = Math.floor(minutes / 60),
                    m = minutes % 60;

                vm.set('sexagesimalformat', Ext.String.leftPad(h, 2, '0') + ':' + Ext.String.leftPad(m, 2, '0'));
                vm.set('hasRecord', true);
            }
            vm.notify();
        } finally {
            me.updatingTime = updatingTime;
        }
    },
    loadTimePicker: function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'loadTimePicker');
        let me = this,
            calendar = me.getView().down('timetracker_datepicker');

        if (Ext.isEmpty(me.getViewModel().get('mitarbeiter_id'))) return false;
        calendar.fullUpdate(calendar.activeDate);

    },
    onMitarbeiterChange: function (field, newValue, oldValue) {
        let me = this,
            vm = me.getViewModel();
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onMitarbeiterChange', newValue, oldValue);
        vm.set('mitarbeiter_id', newValue);
        this.loadTimePicker();
    },
    currentStaffId: async function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'currentStaffId');
        let me = this,
            vm = me.getViewModel();
        try {
            if (!Ext.isEmpty(vm.get('mitarbeiter_id'))) return vm.get('mitarbeiter_id');
            let response = await fetch('./timetracker/mitarbeiter_id');
            let data = await response.json();

            console.log('Tualo.timetracker.lazy.controller.Panel', 'currentStaffId', data);
            if (data.success) {
                vm.set('mitarbeiter_id', data.id);
                vm.set('user_login', data.user_login);
                vm.set('organigramm_mitarbeiter', data.organigramm_mitarbeiter);
                me.getViewModel().getStore('mitarbeiter').load();
                me.loadTimePicker();
                return data.id;
            }
        } catch (e) {
            console.error(e);
        }
        return 9999999;
    },
    onNew: async function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onNew');
        let me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            grid = view.down('dslist_zeiterfassung'),
            store = vm.getStore('zeiterfassung'),
            newData = {
                mitarbeiter_id: await me.currentStaffId(),
                state_os: 2,
                remark: '',
                hours: 0,
                task_date: vm.get('currentDate'),
                task_start: new Date(),
                task_end: new Date()
            };

        let fn = () => {
            me._preventReload = true;
            console.log('Tualo.timetracker.lazy.controller.Panel', 'onNew.fn');
            let record = Ext.create('Tualo.DataSets.model.Zeiterfassung', newData);
            store.add(record);
            grid.setSelection(record);
            console.log('onNew', record, store.count());
            setTimeout(() => {
                me._preventReload = false;
            }, 1000);
        }

        setTimeout(fn, 10);



        // vm.set('mitarbeiter_id', await me.currentStaffId());

        /*
        record.set('mitarbeiter_id', await me.currentStaffId());
        record.set('state_os', 2); // nicht bekannt
        record.set('remark', '');
        record.set('hours', 0);
        record.set('task_date', vm.get('currentDate'));
        record.set('task_start', new Date());
        record.set('task_end', new Date());

        vm.set('record', record);
        */
        // vm.set('isNew', true);
        //vm.set('hasRecord', true);
        // console.log('onNew', 'after setting view model', record);


        //

    },
    onTaskDateChange: function (field, newValue, oldValue) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onTaskDateChange', field, newValue, oldValue);
        let me = this,
            vm = me.getViewModel();
        if (me.updatingTime || !newValue || !vm.get('record')) {
            return;
        }
        console.log('onTaskDateChange', newValue, oldValue);
        vm.set('currentDate', Ext.util.Format.date(newValue, 'Y-m-d'));
        let start = vm.get('record.task_start');
        if (start) {
            let updatedStart = new Date(start.getTime());
            updatedStart.setFullYear(newValue.getFullYear(), newValue.getMonth(), newValue.getDate());
            me.updatingTime = true;
            try {
                vm.set('record.task_start', updatedStart);
                vm.notify();
            } finally {
                me.updatingTime = false;
            }
        }
        let stop = vm.get('record.task_end');
        if (stop) {
            let updatedStop = new Date(stop.getTime());
            updatedStop.setFullYear(newValue.getFullYear(), newValue.getMonth(), newValue.getDate());
            me.updatingTime = true;
            try {
                vm.set('record.task_end', updatedStop);
                vm.notify();
            } finally {
                me.updatingTime = false;
            }
        }
        me.getViewModel().getStore('zeiterfassung').load();

        //.getStore().load();

    },
    onSave: function () {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onSave');
        let me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            grid = view.down('dslist_zeiterfassung'),
            store = vm.getStore('zeiterfassung'),
            record = vm.get('record');
        view.getForm().getValues()



        if (vm.get('isNew')) {
            store.add(record);
            grid.setSelection(record);
        }

        store.sync({
            scope: me,
            success: function (batch, options) {
                console.log('Tualo.timetracker.lazy.controller.Panel', 'onSave.success', batch, options);
                console.log('sync successful', batch, options);
                me.loadTimePicker();
            },
            failure: function (batch, options) {
                console.log('Tualo.timetracker.lazy.controller.Panel', 'onSave.failure', batch, options);
                console.log('sync failed', batch, options);
            }
        });
    },
    onHighlightitem: function (a, b, date) {
        console.log('Tualo.timetracker.lazy.controller.Panel', 'onHighlightitem', a, b, date);
        let me = this,
            vm = me.getViewModel(),
            store = vm.getStore('zeiterfassung');

        vm.set('currentDate', Ext.util.Format.date(date, 'Y-m-d'));
        /*
        let filters = store.getFilters(); // an Ext.util.FilterCollection
        filters.add([{
            property: 'task_date',
            'operator': 'eq',
            value: Ext.util.Format.date(date, 'Y-m-d')
        }]);
        store.setFilters(filters);
        */
        store.load();
    }
});