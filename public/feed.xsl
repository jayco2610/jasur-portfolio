<?xml version="1.0" encoding="UTF-8"?>
<!-- Лента RSS машинная, её читают программы. Но если человек откроет её
     в браузере, без этого файла он видит голый текст без разметки.
     Здесь лента превращается в обычную страницу. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="rss/channel/title" /></title>
        <style>
          body { background:#fff; color:#0c0c0b; margin:0;
            font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; }
          .w { max-width:760px; margin:0 auto; padding:0 24px; }
          .tiny { font-size:9.5px; letter-spacing:.26em; text-transform:uppercase; color:#767268; }
          header { border-bottom:2px solid #0c0c0b; padding:56px 0 24px; }
          h1 { font-size:clamp(32px,5vw,56px); letter-spacing:-.04em; line-height:1; margin:14px 0 0; }
          .note { background:#F5F4F0; border:1px solid #e2e0da; padding:18px 20px; margin-top:26px;
            font-size:14.5px; line-height:1.6; color:#3b3932; }
          .note a { color:#0c0c0b; }
          ul { list-style:none; padding:0; margin:0; }
          li { border-bottom:1px solid #e2e0da; padding:26px 0; }
          li a { font-size:21px; font-weight:700; letter-spacing:-.026em; line-height:1.2;
            color:#0c0c0b; text-decoration:none; }
          li a:hover { text-decoration:underline; text-underline-offset:4px; }
          p.d { font-size:15px; line-height:1.6; color:#3b3932; margin:10px 0 0; max-width:34em; }
          footer { padding:28px 0 70px; }
          footer a { color:#0c0c0b; }
        </style>
      </head>
      <body>
        <div class="w">
          <header>
            <div class="tiny">Лента обновлений</div>
            <h1><xsl:value-of select="rss/channel/title" /></h1>
            <div class="note">
              Это RSS-лента. Её адрес можно вставить в любую читалку
              и получать новые материалы автоматически. Чтобы просто читать,
              откройте <a href="/writing">блог</a>.
            </div>
          </header>
          <ul>
            <xsl:for-each select="rss/channel/item">
              <li>
                <div class="tiny"><xsl:value-of select="pubDate" /></div>
                <a href="{link}"><xsl:value-of select="title" /></a>
                <p class="d"><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>
          <footer>
            <a class="tiny" href="/writing">← Вернуться в блог</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
