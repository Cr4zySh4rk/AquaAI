<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="all.css">
    <link rel="stylesheet" href="wifi.css" />
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
                <a href="settings.php"><span class="fa-solid fa-gear"></span>
                    <span>Settings</span></a>
            </li>
            <li>
                <a href="wifi.php" class="active"><span class="fa-solid fa-wifi"></span>
                    <span>WiFi Settings</span></a>
            </li>
            
        </ul>
    </nav>
    <div class="hidnav">
        <ul>
          <li>
              <a href="index.php" ><span class="fa-solid fa-house"></span>
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
            <a href="wifi.php"><span class="fa-solid fa-close"></span>
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
            Wifi-Settings
        </h2>
      </header>

      <div class="wrapbody">
        <div class="wifi">
            <span class="fa-solid fa-wifi" style="font-size: 7rem; color: var(--main-color); position: relative; left: 3rem;bottom: 0.5rem;"></span>
            <div class="wifisettings">
                <span>
                    <form action="wifi.php" method="post">
                        <div class="creds">
                            <div class="ssid">
                                <label class="wifilabel" for="SSID">SSID:</label>
                                <input type="text" class="textbox" id="SSID" name="SSID" placeholder="(min length: 2)">
                            </div>
                            <div class="password">
                                <label class="wifilabel" for="Password">Password:</label>
                                <input type="text" class="textbox" id="Password" name="Password" placeholder="(min length: 8)">
                            </div>
                        </div>
                        <div>
                            <label class="wifilabel" for="Channel">Channel:</label>
                            <select class="channel"name="Channel">
                                <option value="">Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                            </select>
                        </div>
                        <div class="wifibutton">
                            <input type="submit" class="button" value="Apply" name="apply" data-inline="true" onclick="confirm()">
                            <input type="submit" class="button" value="Default" name="noapply" data-inline="true" onclick="confirm()">
                        </div>
                    </form>
                </span>
            </div>
        </div>
      </div>
    </div>
    
  </body>
</html>

<?php
if(isset($_POST['apply'])) {
   $ssid = $_POST["SSID"];
   $passwd = $_POST["Password"];
   $ch = $_POST["Channel"];
   if($ch != "Select" || $ch != "") {
    shell_exec("nohup sudo bash /home/pi/Scripts/cngwifi.sh $ssid $passwd $ch");
   }
   else {
    shell_exec("nohup sudo bash /home/pi/Scripts/cngwifi.sh $ssid $passwd 7");
   }
  }
if(isset($_POST['noapply'])) {
   shell_exec("sudo cp /etc/hostapd/hostapd.conf.orig /etc/hostapd/hostapd.conf");
  }
?>
