<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="videotest.css" type="text/css">
    <title>videoTEST</title>
  </head>
  <body bottommargin="0" leftmargin="0" rigthmargin="0" topmargin="0">
    <div class="mainblock"> videoTEST <br />
      <?php
        $db = new SQLite3('db/videotest.db');
        $results = $db->query('SELECT * FROM videos;');
        while ($row = $results->fetchArray()) { ?>
          <div class="mediablock">
            <?php echo $row["id"]; ?>
          <br />
            <?php echo $row["title"]; ?>
          <br />
            <?php echo $row["path"].$row["filename"]; ?>
          </div>
      <?php
        }
      ?>
      </table>
    </div>
  </body>
</html>
