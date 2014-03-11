/*

- Libraries on CDN (json2) cdnjs
- Display server errors

Shared memory installation:
http://www.php.net/manual/en/shmop.installation.php
http://www.php.net/manual/en/shmop.examples-basic.php
http://support.lampcms.com/viewquestion/quest547/Registering-user-crashes-LampCMS-shmop_open-unable-to-attach-or

http://www.ibm.com/developerworks/library/os-php-shared-memory/
http://www.php.net/manual/en/function.shmop-open.php

=== Checking if a shared memory exists ===
The solution provided by Mitchell_Shnier at ieee dot orgZ doesn't work on my computer - I get a warning "Invalid flag ac".

In order to check if a shared-memory exists, you just have to open it with the "a" or "w" flag, while hiding the warnings using the "@" operator:
<?php
@$shid = shmop_open($systemId, "a", 0666, 0);
if (!empty($shid)) {
            ... shared memory exists
} else {
            ... shared memory doesn't exist
}
?>

*/