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
                $user_login = $db->singleValue('select getSessionUser() user_login', [], 'user_login');
                if ($id === false) {
                    $id = $db->singleValue('select id from mitarbeiter_ersatz where user_login=getSessionUser()', [], 'id');
                    $user_login = $db->singleValue('select user_login from mitarbeiter where id={id}', ['id' => $id], 'user_login');
                }

                $organigramm_mitarbeiter = $db->singleValue('select organigramm_mitarbeiter({user_login}) organigramm_mitarbeiter ', ['user_login' => $user_login], 'organigramm_mitarbeiter');

                if ($id) {
                    App::result('id',  $id);
                    App::result('user_login', $user_login);
                    App::result('organigramm_mitarbeiter', json_decode($organigramm_mitarbeiter, true));
                    App::result('success', true);
                }
            } catch (\Exception $e) {
                App::result('success', false);
                App::result('msg', $e->getMessage());
            }
        }, ['get'], true, [], self::scope());
    }
}
