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
                        value: "{staff_link}",
                        disabled: "{!canEdit}"
                    },
                    xtype: "combobox_staff_urno"
                },
                {
                    xtype: 'timetracker_datepicker',
                    width: 350,
                    style: {
                        "marginTop": "8px",
                    },
                    rowspan: 5,
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
                        value: "{job_link}",
                        disabled: "{!canEdit}"
                    },
                    xtype: "combobox_tualo_job_id"
                },
                /*{
                    fieldLabel: "Leistungsart",
                    bind:{
                        value: "{tos_link}",
                        disabled: "{!canEdit}"
                    },
                    minChars: 2,
                    xtype: "combobox_artikelgruppen_gruppen_id_kurz"
                },*/
                {
                    fieldLabel: "Leistungsart-ZE",
                    bind: {
                        value: "{tos_link}",
                        disabled: "{!canEdit}"
                    },
                    minChars: 2,
                    xtype: "combobox_view_artikelgruppen_ze_gruppen_id_ze"
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Zeitraum',
                    labelWidth: 100,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'timefield',
                            bind: {
                                value: "{range_start}",
                                disabled: "{!canEdit}"
                            },
                            flex: 1
                        }, {
                            xtype: 'splitter'
                        }, {
                            xtype: 'timefield',
                            bind: {
                                value: "{range_stop}",
                                disabled: "{!canEdit}"
                            },
                            flex: 1
                        }
                    ]
                },
                /*
                {
                    fieldLabel: "Zeit",
                    maxValue: 12,
                    decimalSeparator: ',',
                    decimalPrecision: 2,
                    minValue: 0,
                    bind:{
                        value: "{hours}",
                        disabled: "{!canEdit}"
                    },
                    xtype: "numberfield"
                },
                */
                {
                    fieldLabel: "Zeit (h)",
                    xtype: 'timefield',
                    name: 'in',
                    minValue: '00:00',
                    maxValue: '08:00',
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
                        value: "{remark_os}",
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
            xtype: 'dslist_view_staff_time_mat_entry',
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
                store: '{time_mat_entry}',
                autoLoad: false
            },
            flex: 1
        }

    ]
})