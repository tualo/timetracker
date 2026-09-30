Ext.define('Tualo.routes.timetracker.Input', {
    statics: {
        load: async function () {
            return [
                {
                    name: 'Timetracker input',
                    path: '#timetracker/input'
                }
            ]
        }
    },
    url: 'timetracker/input',
    handler: {
        action: function () {

            Ext.getApplication().addView('Tualo.timetracker.lazy.Panel', {
                // type: type,
                // reportnumber: reportnumber
            });

        },
        before: function (action) {
            action.resume();
        }

    }
});