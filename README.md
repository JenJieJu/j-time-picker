# j-time-picker



### Installing

```
    npm i j-time-picker --save
```


## Running the demo

```
    npm install
    npm run dev
```

## Enjoy it
```
    <div id="time"></div>
    <script type="text/javascript">
    var timePicker = new window.jTimePicker('#time', {
        defaultValue: new Date('2018-10-01'),
        defaultValues: [new Date('2018-10-01'), new Date()],
        onChange: function(v) {
            console.log('onChange', timePicker)
        },
        isRange: true //是否时间段选择
    });
    </script>
```

## Updata
```
0.0.8 fix:bug
0.0.9 fix:bug
0.0.12 link github
0.0.13 add:输入具体年月
```
