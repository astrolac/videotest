<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="videotest.css" type="text/css">
    <title>videoTEST</title>
  </head>
  <body bottommargin="0" leftmargin="0" rigthmargin="0" topmargin="0">
    <div class="mainblock">
      <?php
        echo "<table>";
	foreach($_SERVER as $key=>$value) {
          echo "<tr>";
          echo "<td align=\"right\">".$key."</td><td align=\"left\">".$value."</td>";
          echo "</tr>";
        }
        echo "</table>";
      ?>
    </div>
  </body>
</html>
