Ext.define('Tualo.Timetracker.Loader', {
    singleton: true,

    constructor: function () {
        Ext.Loader.setPath('Tualo.timetracker.lazy', './jstimetracker');
    }
});
Ext.Loader.setPath('Tualo.timetracker.lazy', './jstimetracker');
