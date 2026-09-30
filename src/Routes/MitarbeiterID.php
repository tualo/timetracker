<?php

namespace Tualo\Office\Timetracker\Routes;

use Tualo\Office\Basic\Route as BasicRoute;
use Tualo\Office\Basic\TualoApplication as App;
use Tualo\Office\Basic\RouteSecurityHelper;
use Tualo\Office\Timetracker\Services\TimeService;

class MitarbeiterID extends \Tualo\Office\Basic\RouteWrapper
{
    public static function scope(): string
    {
        return 'basic';
    }
    public static function register()
    {
        BasicRoute::add('/timetracker/mitarbeiter_id', function ($matches) {
            App::contenttype('application/json');
            App::result('success', false);
            try {
                $db = App::get('session')->getDB();
                $id = $db->singleValue('select id from mitarbeiter where user_login=getSessionUser()', [], 'id');
                if ($id === false) {
                    $id = $db->singleValue('select id from mitarbeiter_ersatz where user_login=getSessionUser()', [], 'id');
                }

                if ($id) {
                    App::result('id',  $id);
                    App::result('success', true);
                }
            } catch (\Exception $e) {
                App::result('success', false);
                App::result('msg', $e->getMessage());
            }
        }, ['get'], true, [], self::scope());
    }
}
