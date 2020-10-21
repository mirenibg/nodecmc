const PAGE =
    `<!DOCTYPE html>
<html>

<head>
    [[[ metadata ]]]
    <title>[[[ title ]]]</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
</head>

<body>
    [[[ navigation ]]]

    [[[ body ]]]
</body>

</html>`;

const NAVIGATON =
    `<nav class="navbar navbar-default">
<div class="container-fluid">
    <div class="navbar-header">
        <a class="navbar-brand" href="#">S3 static site</a>
    </div>
    <ul class="nav navbar-nav">
        <li class="active"><a href="#">Home</a></li>
        [[[ items ]]]
    </ul>
</div>
</nav>

<div class="container">
<h3>S3 static content</h3>
<p>Some static content that is on the s3 bucket.</p>
</div>`;

const NAVIGATION_ITEM =
    `<li><a href="/[[[ slug ]]]">[[[ title ]]]</a></li>`;

/**
 * Generate static html file
 * 
 * @param {any} page 
 */
exports.generatePage = (page, navigation = null) => {
console.log(page);

    result = PAGE;
    result = result.replace('[[[ metadata ]]]', page.meta_data || '');
    result = result.replace('[[[ title ]]]', page.title || '');
    result = result.replace('[[[ navigation ]]]', navigation || '');
    result = result.replace('[[[ body ]]]', page.body || '');

    return result;
}

