function ease(v, pow = 4){
    return 1 - Math.pow(1 - v, pow);
}

function easeInOutCubic(x, t, b, c, d){
    return (t/=d/2) < 1
    ? c/2*t*t*t + b
    : c/2*((t-=2)*t*t + 2) + b;
}

class ExpandAnimation
{
    constructor(settings)
    {
        this.expandClass = this._getRandName('exp');
        this.expandContentClass = this._getRandName('exp');

        var animation = this._create(settings);

        this._append(animation);
    }

    _append(str)
    {
        var style = document.createElement("style");
            style.innerText = str;

        document.head.appendChild(style);
    }

    _create(settings)
    {
        var animName = this._getRandName('anim'),
            invAnimName = this._getRandName('anim'),
            timingFunction = settings.timingFunction || ease,
            animation = '',
            invAnimation = '';
            
        for (var step = 0; step <= settings.steps; step++)
        {
            let scale = timingFunction(step / settings.steps),
                invScale = 1 / scale;

            if (scale == Infinity) scale = 30;
            if (invScale == Infinity) invScale = 30;

            animation += `${step}% { transform: scaleY(${scale}); }`;
            invAnimation += `${step}% { transform: scaleY(${invScale}); }`;
        }

        return `
        @keyframes ${animName}{ ${animation} }
        @keyframes ${invAnimName}{${invAnimation}}
        .${this.expandClass} {animation:${animName} ${settings.duration}ms linear forwards}
        .${this.expandContentClass} {animation:${invAnimName} ${settings.duration}ms linear forwards}`;
    }

    _getRandName(prefix)
    {
        return prefix + Math.round(Math.random() * 10000);
    }
}

export var animation = new ExpandAnimation({
    steps : 100,
    duration : 350
});