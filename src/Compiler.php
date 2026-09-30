<?php

namespace Tualo\Office\Timetracker;

use Tualo\Office\ExtJSCompiler\ICompiler;
use Tualo\Office\ExtJSCompiler\CompilerHelper;

class Compiler implements ICompiler
{


    public static function getFiles()
    {
        return CompilerHelper::getFiles(__DIR__, 'timetracker', 10000);
    }
}
