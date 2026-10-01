Ext.define('Tualo.timetracker.lazy.controller.Panel', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timetracker',

    onAfterRender: function () {
        console.log('afterrender***********');
        let me = this;
        let async_fn = async () => {
            let res = await me.currentStaffId();
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

    initViewModel: function (vm) {
        vm.bind('{selectedEntry}', 'onSelect', this);
    },

    onBeforefilter: function (filters) {
        console.log('onBeforefilter', filters);
        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) return false;
        filters.add({
            'id': 'mitarbeiter_id',
            property: 'mitarbeiter_id',
            operator: 'eq',
            value: this.getViewModel().get('mitarbeiter_id')
        });
        return true;
    },
    onZeiterfassungPickerBeforeLoad: function (store, operation, eOpts) {
        console.log('onZeiterfassungPickerBeforeLoad beforeload', operation);
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
        console.log('onZeiterfassungBeforeLoad beforeload', operation);
        let extraParams = store.getProxy().getExtraParams(),
            filters = [];
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };
        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) return false;
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
    onMitarbeiterBeforeLoad: function (store, operation, eOpts) {
        console.log('onMitarbeiterBeforeLoad beforeload', operation);
        let extraParams = store.getProxy().getExtraParams(),
            filters = [];
        if (Ext.isEmpty(extraParams)) { extraParams = {}; };

        if (Ext.isEmpty(this.getViewModel().get('mitarbeiter_id'))) return false;
        filters.push({
            property: 'id',
            operator: 'eq',
            value: this.getViewModel().get('mitarbeiter_id')
        });
        extraParams.filter = Ext.JSON.encode(filters);
        store.getProxy().setExtraParams(extraParams);
    },
    onJobBeforeLoad: function (store, operation, eOpts) {
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
        let me = this,
            vm = me.getViewModel();
        if (nv && !me.updatingTime) {
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
        let me = this,
            vm = me.getViewModel();
        if (me.updatingTime) {
            return;
        }
        me.updatingTime = true;
        try {
            vm.set(field.getName(), value);
            let start = vm.get('record.task_start'),
                stop = vm.get('record.task_end');
            if (!start || !stop) {
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
        let me = this,
            vm = me.getViewModel();
        vm.set('isNew', false);
        if (Ext.isEmpty(selection)) {
            vm.set('hasRecord', false);
        } else {
            vm.set('record', selection);

            let h = Math.floor(vm.get('hours'));
            let m = (vm.get('hours') - h) * 60;

            me.updatingTime = true;
            try {
                vm.set('sexagesimalformat', Ext.String.leftPad(h, 2, '0') + ':' + Ext.String.leftPad(Math.round(m), 2, '0'));
                vm.notify();
            } finally {
                me.updatingTime = false;
            }
            vm.set('hasRecord', true);
        }
    },
    loadTimePicker: function () {
        let me = this,
            vm = me.getViewModel();


        if (Ext.isEmpty(me.getViewModel().get('mitarbeiter_id'))) return false;
        /*me.getView().down('timetracker_datepicker').store.load({
            params: {
                filter: JSON.stringify(
                    [
                        {
                            property: 'mitarbeiter_id',
                            operator: 'eq',
                            value: vm.get('mitarbeiter_id')
                        },
                        {
                            property: 'task_date',
                            operator: 'gt',
                            value: '2026-09-01'
                        },
                        {
                            property: 'task_date',
                            operator: 'lt',
                            value: '2026-12-01'
                        }
                    ]
                )
            }
        });
        */
    },
    currentStaffId: async function () {
        let me = this,
            vm = me.getViewModel();
        try {
            let response = await fetch('./timetracker/mitarbeiter_id');
            let data = await response.json();
            if (data.success) {
                vm.set('mitarbeiter_id', data.id);
                me.getViewModel().getStore('mitarbeiter').load();
                me.loadTimePicker();
                return data.id;
            }
        } catch (e) {
            console.error(e);
        }
        window.me = me;
        return 9999999;
    },
    onNew: async function () {
        let me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            grid = view.down('dslist_zeiterfassung'),
            store = vm.getStore('zeiterfassung'),
            record = Ext.create('Tualo.DataSets.model.Zeiterfassung')

        vm.set('mitarbeiter_id', await me.currentStaffId());

        record.set('mitarbeiter_id', await me.currentStaffId());
        record.set('state_os', 2); // nicht bekannt
        record.set('remark', '');
        record.set('hours', 0);
        record.set('task_date', vm.get('currentDate'));
        record.set('task_start', new Date());
        record.set('task_end', new Date());

        vm.set('record', record);
        vm.set('isNew', true);
        vm.set('hasRecord', true);
        // store.add(record);
        // grid.setSelection(record);

    },
    onTaskDateChange: function (field, newValue, oldValue) {
        let me = this,
            vm = me.getViewModel();
        if (!newValue || !vm.get('record')) {
            return;
        }
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

        store.sync();
    },
    onHighlightitem: function (a, b, date) {
        console.log('onHighlightitem', date);
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