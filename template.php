<?php session_start(); ?>
<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <?php require $_SERVER["DOCUMENT_ROOT"] . "/modules/head.html" ?>
    <title>Kulturverein Manufaktur</title>
  </head>
  <body>
    <?php require $_SERVER["DOCUMENT_ROOT"] . "/modules/nav.html" ?>
    <div class="ui container">
      <?php require $_SERVER["DOCUMENT_ROOT"] . "/modules/infobox.php" ?>
      <div class="ui segments">
        <main class="ui segment">



        </main>
        <?php require $_SERVER["DOCUMENT_ROOT"] . "/modules/footer.html" ?>
      </div>
    </div>
    <?php require $_SERVER["DOCUMENT_ROOT"] . "/modules/cookieBanner.php" ?>
    <script src="/js/jquery-3.7.0.slim.min.js"></script>
    <script src="/js/semantic.min.js"></script>
    <script type="text/javascript">
      $('.dropdown').dropdown();
      $('.message .close, #acceptCookieButton')
        .on('click', function() {
          $(this)
            .closest('.message')
            .transition('fade')
          ;
        })
      ;
    </script>
  </body>
</html>
