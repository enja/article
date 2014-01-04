#cl-strings [![Build Status](https://travis-ci.org/shakyShane/cl-strings.png?branch=master)](https://travis-ci.org/shakyShane/cl-strings)
> String template system for multi-colour console output with interpolation.

Basically a wrapper around [cli-color](https://npmjs.org/package/cli-color) & [lodash templates](http://lodash.com/docs#template)


```
npm install cl-strings
```

##Load as dependency in your project
```
var compile = require("cl-strings").compile
```

##Multi colours

```
var string = "{green:Hi there} {red:Shane}";
console.log(compile(string));
```
![image](http://www.websitesbyshane.co.uk/Screen%20Shot%202013-12-08%20at%2022.46.21-mBr1Sp9BxL.png)


##Colour in strings with interpolation

```
var string = "{green:Hi there {:name:}}";
var params = {
	name: "Shane"
}
console.log(compile(string, params));
```
![image](http://www.websitesbyshane.co.uk/Screen%20Shot%202013-12-08%20at%2022.55.40-JjjgYMPPdd.png)

##Partial colour with interpolation

```
var string = "{green:Hi there} {:name:}";
var params = {
	name: "Shane"
}
console.log(compile(string, params));
```
![image](http://www.websitesbyshane.co.uk/Screen%20Shot%202013-12-08%20at%2022.57.42-YsWL6eTzhA.png)
