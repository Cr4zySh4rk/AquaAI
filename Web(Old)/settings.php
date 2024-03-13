<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="all.css">
    <link rel="stylesheet" href="settings.css" />
    <script>
        function EnableDisableTextBox() {
            var selectBox = document.getElementById("selectEnableDisable");
            var txtPassportNumber = document.getElementById("portarea");
            
            txtPassportNumber.disabled = selectBox.value !== "1";

            if (!txtPassportNumber.disabled) {
                txtPassportNumber.focus();
            }
        }
    </script>
    <title>Aqua-AI</title>
  </head>
  <body>
    <input type="checkbox" id="nav-toggle">
    <nav class="nav">
      <div class="sidebar-brand">
        <h1>
          <span
            ><img src="res/logo.png" width="70px" height="70px" alt="" /></span
          ><span>AquaAI</span>
        </h1>
      </div>
      <div class="sidebar-menu">
        <ul>
            <li>
                <a href="index.php"><span class="fa-solid fa-house"></span>
                    <span>Dashboard</span></a>
            </li>
            <li>
                <a href="settings.php" class="active"><span class="fa-solid fa-gear"></span>
                    <span>Settings</span></a>
            </li>
            <li>
                <a href="wifi.php"><span class="fa-solid fa-wifi"></span>
                    <span>WiFi Settings</span></a>
            </li>
        </ul>
    </nav>
    <div class="hidnav">
        <ul>
          <li>
              <a href="index.php"><span class="fa-solid fa-house"></span>
                  <span>Dashboard</span></a>
          </li>
          <li>
              <a href="settings.php"><span class="fa-solid fa-gear"></span>
                  <span>Settings</span></a>
          </li>
          <li>
              <a href="wifi.php"><span class="fa-solid fa-wifi"></span>
                  <span>WiFi Settings</span></a>
          </li>
          <li>
            <a href="settings.php"><span class="fa-solid fa-close"></span>
                <span>Close</span></a>
          </li>
      </ul>
      </div>
    <div class="mainwrap">
      
      <header>
        <h2>
            <label for="nav-toggle">
            <span class="fa-solid fa-bars"></span>
            </label>
            Settings
        </h2>
      </header>

      <div class="wrapbody">
      <form action="" method="post">
        <div class="ftp_enable">
            <h2>FTP: <label class="switch">
                <select id="selectEnableDisable" class="ftp_select" onchange="EnableDisableTextBox()">
                    <option value="">Select</option>    
                    <option value="1">Enable</option>
                    <option value="0">Disable</option>
                </select>
                </h2>
        </div>
        <div class="ftp_port">
            <h2>Port #:  
                <input type="text" id="portarea" name="ftp-port" placeholder="Default port:21" class="textbox" disabled>
            </h2>
        </div>
        <div class="ftp_options">
            <h2><input type="submit" class="button" name="ftp-def" value="Default" id="defbut">
                <input type="submit" class="button" name="ftp-save" value="Save" id="savebut">
            </h2>
        </div>
        <div class="system">
            <div class="system_head">
                <h2>System:</h2>
            </div>
            <div class="system_body">
                <h2><span class="fa-solid fa-power-off"></span><input type="submit" class="button" name="shutdown" value="Shutdown" onclick="alert('Shutting down!')"></h2>
                <h2><span class="fa-solid fa-clock-rotate-left"></span><input type="submit" class="button" name="reboot" value="Reboot" onclick="alert('Rebooting system...')"></h2>
            </div>
        </div>
      </div>
      </form>
    </div>
    
  </body>
</html>

<?php

if(isset($_POST['ftp-save'])) {
    $ftp=$_POST['ftp'];
    if ($ftp == 0) {
        shell_exec("sudo service proftpd stop");
    }
    else if ($ftp == 1) {
        $port=$_POST['ftp-port'];
        if ($port>=0 && $port<=65535) {
            shell_exec("sudo sed -i 's/^Port.*/Port $port/' /etc/proftpd/proftpd.conf");
            shell_exec("sudo service proftpd restart");
        }
        else {
            shell_exec("sudo cp /etc/proftpd/proftpd.conf.orig /etc/proftpd/proftpd.conf");
            shell_exec("sudo service proftpd restart");
        }
    }


  }

  if(isset($_POST['ftp-def'])) {
    shell_exec("sudo cp /etc/proftpd/proftpd.conf.orig /etc/proftpd/proftpd.conf");
    shell_exec("sudo service proftpd restart");
  }

  if(isset($_POST['reboot'])) {
    shell_exec("sudo reboot");
  }

  if(isset($_POST['shutdown'])) {
    shell_exec("sudo shutdown -r now");
  }
?>