import * as THREE from 'https://cdn.bootcdn.net/ajax/libs/three.js/0.156.1/three.module.js';

console.log(THREE);

const chen_threejs_scratch_picture = "data:image/png;base64,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";

const chen_threejs_scratch_icon = "data:image/png;base64,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";

const chen_threejs_scratch_extensionId = "ThreeJS_Scratch";

/** @typedef {string|number|boolean} SCarg 来自Scratch圆形框的参数，虽然这个框可能只能输入数字，但是可以放入变量，因此有可能获得数字、布尔和文本（极端情况下还有 null 或 undefined，需要同时处理 */

class ThreeJS_Scratch {
    constructor(runtime) {
        this.runtime = runtime;

        this.renderer = null;
        this.scene = null;

        this.fov = null;
        this.aspect = null;
        this.near = null;
        this.far = null;
        this.camera = null;

        this.lights = new Object();
        this.objects = new Object();

        this._formatMessage = runtime.getFormatMessage({
            "zh-cn": {
                "ThreeJS_Scratch.name": "ThreeJS",
                "ThreeJS_Scratch.init": "初始化",
                "ThreeJS_Scratch.render": "渲染场景",
                "ThreeJS_Scratch.color_": "颜色: [R][G][B]",
                "ThreeJS_Scratch.tools": "工具",

                "ThreeJS_Scratch.objects": "物体",
                "ThreeJS_Scratch.makeCube": "创建或设置长方体: [name] 长[a] 宽[b] 高[h] 颜色: [color] 位置: x[x] y[y] z[z]",
                "ThreeJS_Scratch.rotationObject": "将物体: [name] 旋转: x[x] y[y] z[z]",
                "ThreeJS_Scratch.getObjectPos": "获取物体: [name] 的[xyz]坐标",
                "ThreeJS_Scratch.getObjectRotation": "获取物体: [name] [xyz]的旋转角度",

                "ThreeJS_Scratch.xyz.x": "x轴",
                "ThreeJS_Scratch.xyz.y": "y轴",
                "ThreeJS_Scratch.xyz.z": "z轴",
                
                "ThreeJS_Scratch.lights": "光照",
                "ThreeJS_Scratch.makePointLight": "创建或设置点光源: [name] 颜色: [color] 光照强度: [intensity] 位置: x[x] y[y] z[z]",
                
            },
            en: {
                "ThreeJS_Scratch.name": "ThreeJS",
                "ThreeJS_Scratch.init": "init",
                "ThreeJS_Scratch.render": "render",
                "ThreeJS_Scratch.color_": "color: [R][G][B]",
                "ThreeJS_Scratch.tools": "tools",

                "ThreeJS_Scratch.objects": "objects",
                "ThreeJS_Scratch.makeCube": "Create or make a Cube: [name] length[a] width[b] height[h] color: [color] position: x[x] y[y] z[z]",
                "ThreeJS_Scratch.rotationObject": "Object: [name] rotation: x[x] y[y] z[z]",
                "ThreeJS_Scratch.getObjectPos": "get Object: [name]\'s [xyz] pos",
                "ThreeJS_Scratch.getObjectRotation": "get Object: [name]\'s  [xyz] rotation",
                
                "ThreeJS_Scratch.xyz.x": "x-axis",
                "ThreeJS_Scratch.xyz.y": "y-axis",
                "ThreeJS_Scratch.xyz.z": "z-axis",

                "ThreeJS_Scratch.lights": "lights",
                "ThreeJS_Scratch.makePointLight": "Create or make a PointLight: [name] color: [color] intensity: [intensity] position: x[x] y[y] z[z]",
            }
        })
    }

    /**
     * 翻译
     * @param {string} id
     * @return {string}
     */
    formatMessage(id) {
        return this._formatMessage({
            id,
            default: id,
            description: id
        });
    }

    getInfo() {
        return {
            id: chen_threejs_scratch_extensionId, // 拓展id
            name: this.formatMessage("ThreeJS_Scratch.name"), // 拓展名
            blockIconURI: chen_threejs_scratch_icon,
            menuIconURI: chen_threejs_scratch_icon,
            color1: "#00B080",
            color2: "#2C9C87",
            color3: "#0E7A66",
            blocks: [  // 放积木：
                {
                    opcode: "init",
                    blockType: "command",
                    text: this.formatMessage("ThreeJS_Scratch.init"),
                },
                {
                    opcode: "render",
                    blockType: "command",
                    text: this.formatMessage("ThreeJS_Scratch.render"),
                },
                
                "---"+this.formatMessage("ThreeJS_Scratch.objects"),
                {
                    opcode: "makeCube",
                    blockType: "command",
                    text: this.formatMessage("ThreeJS_Scratch.makeCube"),
                    arguments: {
                        name: {
                            type: "string",
                            defaultValue: 'name',
                        },
                        a: {
                            type: "number",
                            defaultValue: 5,
                        },
                        b: {
                            type: "number",
                            defaultValue: 5,
                        },
                        h: {
                            type: "number",
                            defaultValue: 5,
                        },
                        color: {
                            type: "number",
                        },
                        x: {
                            type: "number",
                            defaultValue: 0,
                        },
                        y: {
                            type: "number",
                            defaultValue: 0,
                        },
                        z: {
                            type: "number",
                            defaultValue: 0,
                        },
                        
                    },
                },
                {
                    opcode: "rotationObject",
                    blockType: "command",
                    text: this.formatMessage("ThreeJS_Scratch.rotationObject"),
                    arguments: {
                        name: {
                            type: "string",
                            defaultValue: 'name',
                        },
                        x: {
                            type: "number",
                            defaultValue: 0,
                        },
                        y: {
                            type: "number",
                            defaultValue: 0,
                        },
                        z: {
                            type: "number",
                            defaultValue: 0,
                        },
                        
                    },
                },
                {
                    opcode: "getObjectPos",
                    blockType: "reporter",
                    text: this.formatMessage("ThreeJS_Scratch.getObjectPos"),
                    arguments: {
                        name: {
                            type: "string",
                            defaultValue: 'name',
                        },
                        xyz: {
                            type: "string",
                            menu: "xyz",
                        },
                    },
                },
                {
                    opcode: "getObjectRotation",
                    blockType: "reporter",
                    text: this.formatMessage("ThreeJS_Scratch.getObjectRotation"),
                    arguments: {
                        name: {
                            type: "string",
                            defaultValue: 'name',
                        },
                        xyz: {
                            type: "string",
                            menu: "xyz",
                        },
                    },
                },
                "---"+this.formatMessage("ThreeJS_Scratch.lights"),
                {
                    opcode: "makePointLight",
                    blockType: "command",
                    text: this.formatMessage("ThreeJS_Scratch.makePointLight"),
                    arguments: {
                        name: {
                            type: "string",
                            defaultValue: 'name',
                        },
                        color: {
                            type: "number",
                        },
                        intensity: {
                            type: "number",
                            defaultValue: 1,
                        },
                        x: {
                            type: "number",
                            defaultValue: 0,
                        },
                        y: {
                            type: "number",
                            defaultValue: 0,
                        },
                        z: {
                            type: "number",
                            defaultValue: 0,
                        },
                        
                    },
                },
                "---"+this.formatMessage("ThreeJS_Scratch.tools"),
                {
                    opcode: "color_",
                    blockType: "reporter",
                    text: this.formatMessage("ThreeJS_Scratch.color_"),
                    arguments: {
                        R: {
                            type: "number",
                            defaultValue: 255,
                        },
                        G: {
                            type: "number",
                            defaultValue: 255,
                        },
                        B: {
                            type: "number",
                            defaultValue: 255,
                        },
                    },
                },
            ],
            
            menus: {
                xyz: {
                    acceptReporters: false,
                    items: [
                        {

                            text: this.formatMessage('ThreeJS_Scratch.xyz.x'),
                            value: 'x'
                        },
                        {

                            text: this.formatMessage('ThreeJS_Scratch.xyz.y'),
                            value: 'y'
                        },
                        {

                            text: this.formatMessage('ThreeJS_Scratch.xyz.z'),
                            value: 'z'
                        },
                        
                    ]
                },
            }
        };
    }

    /**
     * 初始化
     */
    init(args) {
        var tc = document.getElementsByClassName('gandi_stage_stage_1fD7k')[0].getElementsByTagName("canvas")[0];
        tc.removeAttribute("data-xg_idx");
        this.renderer = new THREE.WebGLRenderer({ canvas: tc });
        this.renderer.setClearColor('#000000'); // 设置渲染器背景为黑色
        this.scene = new THREE.Scene();

        this.fov = 40; // 视野范围
        this.aspect = this.runtime.stageWidth / this.runtime.stageHeight; // 相机默认值 画布的宽高比
        this.near = 0.1; // 近平面
        this.far = 1000; // 远平面
        // 透视投影相机
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);

        //console.log(THREE);
        //console.log(this.renderer);
        //console.log(this.runtime);
        console.log(this.scene);
        //console.log(this.camera);
        
    }

    /**
     * 
     * 渲染，放在主循环里
     */
    render(args) {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 创建或设置长方体
     * @param {string} args.name
     * @param {number} args.a
     * @param {number} args.b
     * @param {number} args.h
     * @param {number} args.color
     * @param {number} args.x
     * @param {number} args.y
     * @param {number} args.z
     */
    makeCube(args) {
        var name = Scratch.Cast.toString(args.name)
        var geometry = new THREE.BoxGeometry (Scratch.Cast.toNumber(args.a), Scratch.Cast.toNumber(args.b), Scratch.Cast.toNumber(args.h));
        var material = new THREE.MeshPhongMaterial({
            color: Scratch.Cast.toNumber(args.color),
        });
        this.objects[name] = new THREE.Mesh(geometry, material);
        this.objects[name].position.set(Scratch.Cast.toNumber(args.x), Scratch.Cast.toNumber(args.y), Scratch.Cast.toNumber(args.z));
        this.scene.add(this.objects[name]);
    }

    rotationObject(args) {
        var name = Scratch.Cast.toString(args.name);
        this.objects[name].rotation.x = THREE.MathUtils.degToRad(Scratch.Cast.toNumber(args.x));
        this.objects[name].rotation.y = THREE.MathUtils.degToRad(Scratch.Cast.toNumber(args.y));
        this.objects[name].rotation.z = THREE.MathUtils.degToRad(Scratch.Cast.toNumber(args.z));
    }
    
    /**
     * 获取物体坐标
     * @param {string} args.name
     * @param {string} args.xyz
     */
    getObjectPos(args) {
        var name = Scratch.Cast.toString(args.name);
        switch (args.xyz) {
            case 'x':
                return this.objects[name].position.x;
            case 'y':
                return this.objects[name].position.y;
            case 'z':
                return this.objects[name].position.z;
        }
    }

    /**
     * 获取物体旋转角度
     * @param {string} args.name
     * @param {string} args.xyz
     */
    getObjectRotation(args) {
        var name = Scratch.Cast.toString(args.name);
        switch (args.xyz) {
            case 'x':
                return THREE.MathUtils.radToDeg(this.objects[name].rotation.x);
            case 'y':
                return THREE.MathUtils.radToDeg(this.objects[name].rotation.y);
            case 'z':
                return THREE.MathUtils.radToDeg(this.objects[name].rotation.z);
        }
    }

    /**
     * 创建或设置点光源
     * [name] 颜色: [color] 光照强度: [intensity] 位置:x[x] y[y] z[z]
     * @param {string} args.name
     * @param {number} args.color
     * @param {number} args.intensity
     * @param {number} args.x
     * @param {number} args.y
     * @param {number} args.z
     */
    makePointLight(args) {
        var name = Scratch.Cast.toString(args.name)
        this.lights[name] = new THREE.PointLight(Scratch.Cast.toNumber(args.color), Scratch.Cast.toNumber(args.intensity), 0);  //创建光源
        this.lights[name].position.set(Scratch.Cast.toNumber(args.x), Scratch.Cast.toNumber(args.y), Scratch.Cast.toNumber(args.z));  //设置光源的位置
        this.scene.add(this.lights[name]);  //在场景中添加光源
    }

    /**
     * 处理颜色
     * @param {number} args.R
     * @param {number} args.G
     * @param {number} args.B
     * @return {number}
     */
    color_(args) {
        return Scratch.Cast.toNumber(args.R)*65536 + Scratch.Cast.toNumber(args.G)*256 + Scratch.Cast.toNumber(args.B);
    }
}

window.tempExt = {
    Extension: ThreeJS_Scratch,
    info: {
        name: "ThreeJS_Scratch.name",
        description: "ThreeJS_Scratch.descp",
        extensionId: chen_threejs_scratch_extensionId,
        iconURL: chen_threejs_scratch_picture,
        insetIconURL: chen_threejs_scratch_icon,
        featured: true,
        disabled: false,
        collaborator: "陈思翰 @ CCW"
    },
    l10n: {
        "zh-cn": {
            "ThreeJS_Scratch.name": "ThreeJS_Scratch",
            "ThreeJS_Scratch.descp": "3D!"
        },
        en: {
            "ThreeJS_Scratch.name": "ThreeJS_Scratch",
            "ThreeJS_Scratch.descp": "3D!"
        }
    }
};