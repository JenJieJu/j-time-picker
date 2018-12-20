<!DOCTYPE html>
<html lang="en">

<head>
    <!-- 禁止 Chrome 浏览器中自动提示翻译 -->
    <meta name="google" value="notranslate">
    <!-- 禁止百度转码 -->
    <meta http-equiv="Cache-Control" content="no-siteapp">
    <!-- 取消缓存 -->
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <!-- 手机屏幕适配 -->
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <style type="text/css">
    html,
    body {
        width: 100%;
        padding: 0px;
        margin: 0px;
        text-align: center;
        font-size: 14px;
        height: 100%;
    }

    .box {
        line-height: 32px;
        padding: 20px;

    }

    #time,#time2 {
        display: inline-block;
    }
    </style>
</head>

<body>
    <div class="box">
        <div id="time" class="aa"></div>
    </div>
    <div><span id="value"></span></div>
    <div class="box">
        <div id="time2" class="aa"></div>
    </div>
    <div><span id="value2"></span></div>
    <script type="text/javascript">
    (function() {


        var timePicker = new window.dcTimePicker('#time', {
            defaultValue: new Date('2018-10-01'),
            defaultValues: [new Date('2018-10-01'), new Date()],
            onChange: function(v) {
                console.log('onChange', timePicker)
                document.getElementById('value').innerHTML = '<div><div>' + timePicker.data.value + '</div><div>' + timePicker.data.startDate + '-' + timePicker.data.endDate + '</div></div>';
            },
            isRange: true
        });

        var timePicker2 = new window.dcTimePicker('#time2', {
            defaultValue: new Date('2018-10-01'),
            defaultValues: [new Date('2018-10-01'), new Date()],
            onChange: function(v) {
                console.log('onChange', timePicker2)
                document.getElementById('value2').innerHTML = '<div><div>' + timePicker.data.value + '</div><div>' + timePicker.data.startDate + '-' + timePicker.data.endDate + '</div></div>';
            },
            isRange: false
        });


        console.log(timePicker)

    })();
    </script>
</body>

</html>