Ext.define('Tualo.timetracker.lazy.Panel', {
    /*** */
    extend: 'Ext.form.Panel',
    title: 'Zeiterfassung',
    alias: 'widget.timetracker',
    requires: [
        'Tualo.timetracker.lazy.picker.Date',
        'Tualo.timetracker.lazy.controller.Panel',
        'Tualo.timetracker.lazy.models.Panel'
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    controller: 'timetracker',
    viewModel: {
        type: 'timetracker'
    },
    listeners: {
        afterrender: 'onAfterRender'
    },
    bind: {
        disabled: "{disabled}"
    },
    getWindowTitle: function () { return "Zeiterfassung" },
    tools: [
        {
            xtype: 'container',
            defaults: {
                flex: '1 1 auto'
            },
            defaultType: 'button',
            layout: {
                type: 'box',
                vertical: false,
                align: 'stretch'
            },
            items: [
                {
                    iconCls: 'x-fa fa-save',
                    handler: 'onSave',
                },
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'onNew'
                }
            ]
        }
    ],
    items: [
        {
            xtype: 'panel',
            "layout": {
                "type": "table",
                "columns": "2",
                "tableAttrs": {
                    "style": {
                        "width": "100%"
                    }
                },
                "tdAttrs": {
                    "style": {
                        "alignContent": "flex-start",
                        "paddingLeft": "8px",
                        "paddingRight": "8px"
                    }
                }

            },
            "defaults": {
                "labelAlign": "top",
                "width": "100%"
            },
            items: [

                {
                    fieldLabel: "Mitarbeiter",
                    bind: {
                        value: "{record.mitarbeiter_id}",
                        disabled: "{!canEdit}",
                        store: '{mitarbeiter}'
                    },
                    xtype: "combobox_mitarbeiter_id"
                },
                {
                    xtype: 'timetracker_datepicker',
                    bind: {
                        store: '{kalender}'
                    },
                    width: 350,
                    style: {
                        "marginTop": "8px",
                    },
                    rowspan: 6,
                    listeners: {
                        select: function () {
                            console.log('select', arguments);
                        },
                        highlightitem: 'onHighlightitem'
                    }
                },
                {
                    fieldLabel: "Job",
                    bind: {
                        value: "{record.job_id}",
                        disabled: "{!canEdit}",
                        store: '{tualo_job}'
                    },
                    xtype: "combobox_tualo_job_id",

                },
                {
                    fieldLabel: "Leistungsart-ZE",
                    bind: {
                        value: "{record.gruppen_id}",
                        disabled: "{!canEdit}"
                    },
                    minChars: 2,
                    xtype: "combobox_view_artikelgruppen_ze_gruppen_id_ze"
                },

                {
                    fieldLabel: "Tag",
                    xtype: 'datefield',
                    name: 'task_date',
                    anchor: '100%',
                    bind: {
                        value: "{record.task_date}",
                        disabled: "{!canEdit}"
                    },
                    listeners: {
                        change: 'onTaskDateChange'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Zeitraum',
                    labelWidth: 100,
                    bind: {
                        disabled: "{!canEdit}"
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'timefield',
                            name: 'range_start',
                            bind: {
                                value: "{record.task_start}",
                            },
                            listeners: {
                                change: 'onRangeChange'
                            },
                            flex: 1
                        }, {
                            xtype: 'splitter'
                        }, {
                            xtype: 'timefield',
                            name: 'range_stop',
                            bind: {
                                value: "{record.task_end}",
                            },
                            listeners: {
                                change: 'onRangeChange'
                            },
                            flex: 1
                        }
                    ]
                },
                {
                    fieldLabel: "Zeit (h)",
                    xtype: 'timefield',
                    name: 'in',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 15,
                    anchor: '100%',
                    bind: {
                        value: "{sexagesimalformat}",
                        disabled: "{!canEdit}"
                    },
                    listeners: {
                        change: 'onHourChange'
                    }
                },
                {
                    fieldLabel: "Anmerkungen",
                    xtype: "textarea",
                    bind: {
                        value: "{record.remark}",
                        disabled: "{!canEdit}"
                    },
                    grow: true,
                    colspan: 2,
                    growMin: 80
                }

                //   dslist_

            ]
        },
        {
            reference: 'table',
            xtype: 'dslist_zeiterfassung',

            title: null,
            features: {
                ftype: 'summary',
                dock: 'bottom'
            },
            plugins: [{
                ptype: 'gridsummaries'
            }],
            bind: {
                selection: '{selectedEntry}',
                store: '{zeiterfassung}',
                autoLoad: false
            },
            flex: 1
        }

    ]
})