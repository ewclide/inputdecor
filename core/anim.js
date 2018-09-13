import { browser } from './func';

function ease(v, pow = 4){
    return 1 - Math.pow(1 - v, pow);
}

export class ExpandAnimation
{
    constructor(settings = {})
    {
        this.expandClass = this._getRandomName('exp');
        this.shrinkClass = this._getRandomName('exp');

        var animation = this._create(settings);

        this._append(animation);
    }

    _append(str)
    {
        var style = document.createElement("style");
        document.head.appendChild(style);

        browser == "IE"
        ? document.styleSheets[document.styleSheets.length - 1].cssText = str
        : style.innerText = str;
    }

    _create(settings)
    {
        var animName = this._getRandomName('anim'),
            invAnimName = this._getRandomName('anim'),
            stepsCount = settings.stepsCount || 25,
            duration = settings.duration || 300,
            timingFunction = settings.timingFunction || ease,
            keyFrames = '',
            invKeyFrames = '';
            
        for (var step = 0; step <= stepsCount; step++)
        {
            let relation = step / stepsCount,
                percent = relation * 100,
                scale = timingFunction(relation),
                invScale = 1 / scale;

            keyFrames += `${percent}%{transform:scaleY(${scale})}`;
            invKeyFrames += `${percent}%{transform:scaleY(${invScale})}`;
        }

        return `
        @keyframes ${animName}{${keyFrames}}
        @keyframes ${invAnimName}{${invKeyFrames}}
        .${this.expandClass}{animation:${animName} ${duration}ms linear forwards}
        .${this.shrinkClass}{animation:${invAnimName} ${duration}ms linear forwards}`;
    }

    _getRandomName(prefix)
    {
        return prefix + Math.round(Math.random() * 10000);
    }
}

export var animation = new ExpandAnimation();