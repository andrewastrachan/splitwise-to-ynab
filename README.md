# splitwise-to-ynab

## Running it

```
npm install -g splitwise-to-ynab
```

given an input like this...

```
Date,Description,Category,Cost,Currency,Friend,Your Name
,,,,,,

7/31/18,May - end of July expenses,General,2270.76,USD,2270.76,-2270.76
8/1/18,August rent,Rent,500,USD,-500,500
8/1/18,Emergency Lights out Orchard Supply,General,63.33,USD,31.67,-31.67
```

you would run...

```
splitwise-to-ynab -i splitwise-export.csv -o ynab-import.csv -i 'Your Name'
```

and you would expect this output...

```
Date,Payee,Memo,Outflow,Inflow
,,,,
7/31/18,May - end of July expenses,General,,2270.76
8/1/18,August rent,Rent,500,
8/1/18,Emergency Lights out Orchard Supply,General,,31.67
```
