Ext.define('Tualo.timetracker.lazy.controller.Panel', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timetracker',

    initViewModel: function (vm) {
        vm.bind('{selectedEntry}', 'onSelect', this);
    },
    onZeiterfassungBeforeLoad: function (store, operation, eOpts) {
        console.log('beforeload', operation);
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
                vm.set('range_start', start);
                vm.set('range_stop', stop);
                vm.set('hours', minutes / 60);
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
            let start = vm.get('range_start'),
                stop = vm.get('range_stop');
            if (!start || !stop) {
                return;
            }
            let minutes = ((stop.getHours() * 60 + stop.getMinutes()) -
                (start.getHours() * 60 + start.getMinutes()) + 1440) % 1440;
            vm.set('hours', minutes / 60);
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
            vm.set('job_link', selection.get('job_link'));
            vm.set('staff_link', selection.get('staff_link'));
            vm.set('tos_link', selection.get('tos_link'));
            vm.set('remark_os', selection.get('remark_os'));
            vm.set('hours', selection.get('hours'));


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
    currentStaffId: async function () {
        let me = this,
            vm = me.getViewModel();
        try {
            let response = await fetch('/timetracker/mitarbeiter_id');
            let data = await response.json();
            if (data.success) {
                vm.set('mitarbeiter_id', data.id);
                return data.id;
            }
        } catch (e) {
            console.error(e);
        }
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
        vm.set('state_os', 2); // nicht bekannt
        vm.set('task_day', vm.get('currentDate'));
        vm.set('remark_os', '');
        vm.set('hours', 0);

        vm.set('record', record);
        vm.set('isNew', true);
        vm.set('hasRecord', true);
        // store.add(record);
        // grid.setSelection(record);

    },
    onSave: function () {
        let me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            grid = view.down('dslist_zeiterfassung'),
            store = vm.getStore('zeiterfassung'),
            record = vm.get('record');
        view.getForm().getValues()

        record.set('job_link', vm.get('job_link'));
        record.set('mitarbeiter_id', vm.get('mitarbeiter_id'));
        record.set('tos_link', vm.get('tos_link'));
        record.set('mitarbeiter_id', vm.get('mitarbeiter_id'));
        record.set('state_os', vm.get('state_os')); // nicht bekannt
        record.set('task_day', vm.get('task_day'));
        record.set('remark_os', vm.get('remark_os'));
        record.set('hours', vm.get('hours'));

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
        let filters = store.getFilters(); // an Ext.util.FilterCollection
        filters.add([{
            property: 'task_day',
            'operator': 'eq',
            value: Ext.util.Format.date(date, 'Y-m-d')
        }]);
        store.setFilters(filters);
        store.load();
    }
});