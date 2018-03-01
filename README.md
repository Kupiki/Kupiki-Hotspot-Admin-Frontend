[![Codacy Badge](https://api.codacy.com/project/badge/Grade/83b2ebb8ca3f46a9a2b08975ff714cd4)](https://www.codacy.com/app/pihomeserver/Kupiki-Hotspot-Admin-Frontend?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Kupiki/Kupiki-Hotspot-Admin-Frontend&amp;utm_campaign=Badge_Grade)

What is Kupiki Hotspot Admin
==================

This application is a web frontend to monitor and administrate the [Kupiki Hotspot](https://github.com/pihomeserver/Kupiki-Hotspot-Script).

Warning
=====

The application is in development so be sure that you will find bugs and errors. So please log them in the [Frontend GitHub issues](https://github.com/Kupiki/Kupiki-Hotspot-Admin-Frontend/issues)
or the  [Backend GitHub issues](https://github.com/Kupiki/Kupiki-Hotspot-Admin-Backend/issues)

Features
=======
- Monitoring
    - Display in a dashboard CPU, disk, memory, uptime and temperature (for Raspberry Pi)
    - OS System information
    - List of services with status
    - Netflow information (if installed)
- System administration
    - Stop / Start services
    - Upgrade system
    - Reboot / Shutdown system
- Hotspot administration
    - Change hotspot name
    - Update hostapd service configuration
- Hotspot management
    - Users management

How to install
=======

- Clone the project with the install script
```
git clone https://github.com/Kupiki/Kupiki-Hotspot-Admin-Install
```
- Run the installation script
```
chmod +x install_kupiki_admin.sh && ./install_kupiki_admin.sh
```
Screenshots
=======

<h4 align="center">Login screen</h4>
<img src="http://www.pihomeserver.fr/hosting/kupiki/login.png">
<h4 align="center">Dashboard</h4>
<img src="http://www.pihomeserver.fr/hosting/kupiki/dashboard.png">
<h4 align="center">Basic configuration</h4>
<img src="http://www.pihomeserver.fr/hosting/kupiki/simple.png">
<h4 align="center">Advanced configuration</h4>
<img src="http://www.pihomeserver.fr/hosting/kupiki/advanced.png">
<h4 align="center">Hotspot management</h4>
<img src="http://www.pihomeserver.fr/hosting/kupiki/mgmt.png">
