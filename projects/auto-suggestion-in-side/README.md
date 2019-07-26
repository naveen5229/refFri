# Auto Suggestion In Side

An auto-suggestion package for [Angular] to show auto suggestions in sidebar.
You can select suggestion by pressing enter/tab key or click on suggestion

![auto-suggestion-in-side](https://a.imge.to/2019/07/25/Zb76w.png)

## How to Use

Run `npm i auto-suggestion-in-side --save`
Import it into App module or Child module where you want to use it.
```
import { AutoSuggestionInSideModule } from 'auto-suggestion-in-side';

imports: [
    ...
    AutoSuggestionInSideModule
    ...
  ],
```

And write it into your componet.html
```
<input type="text" id="suggestion">
<ngx-auto-suggestion-in-side [data]="data" targetId="suggestion" display="name" (select)="handleSelection($event)">
</ngx-auto-suggestion-in-side>
```
Ans this into your componet.ts
```
 data = [
    { name: 'Jai', id: 1 },
    { name: 'Vishal', id: 2 },
    { name: 'sachin', id: 3 },
    { name: 'Lalit', id: 4 }
  ];

  ....

  handleSelection(suggestion) {
    console.log('Suggestion:', suggestion);
  }

```

### Inputs
| Name | Description | Value |
| ------ | ------ | ------ |
| [data] | Suggestions that you want to show in auto-suggestion | It hold array of objects. Examaple: `data=[{id:1, name: 'Suggestion-1'}, {id:2, name: 'Suggestion-2'}]` | 
| [dispay] | Which property of suggestion you want to display | It can be a string or array of string. If display is array, auto-suggestion seperate display with '-' or you can send seperator if you want. Example: `display = 'name'; or display = ['name', 'id']` |
| [separator] (Optional) | separate values if [display] is an array | Its string. Example: `seperator = '-';` |
| [targetId] | Id of input element on which you want to perform suggestion. | Its string. Example: `<input type="text" id="suggestion">` and `targetId = "suggestion"` |
## Output
| Name | Description | Value |
| ------ | ------ | ------ |
| (select) | Emit an event when auto-suggestion select a suggestion | It returns object. Example: `(select)="handleSuggestion($event)"` |

## Further help

Contact me on: <therana.jai@gmail.com>

