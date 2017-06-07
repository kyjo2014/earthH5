/**
 * canvas渲染
 * 
 */
class render3D {

    constructor(opt) {
        if (opt)
            this.proxy(opt)
        this.render = this.render.bind(this);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 800 / 1600, 1, 1000);
        this.camera.position.z = 328;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: document.querySelector('#stage')
        })
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //controls.enableDamping = true;
        //controls.dampingFactor = 0.25;
        this.controls.rotateSpeed = 1;
        this.controls.autoRotate = true;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.renderer.setClearColor(0xffffff, 0)
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(640, 1280);
        this.renderer.render(this.scene, this.camera)
        //自动旋转场景
        this.autoRotate = true
        this.overrideRotate = false
        // this.addEvent()
    }
    proxy(opt) {
        for (let i in opt) {
            this[`_${i}`] = opt[i]
        }
    }
    addEarth() {
        let earth_geometry = new THREE.SphereGeometry(20, 40, 40)

        let earth_texture = new THREE.TextureLoader().load("./static/texture/earth.jpeg");
        let earth_bump = new THREE.TextureLoader().load("./static/texture/bump.jpeg");
        let earth_specular = new THREE.TextureLoader().load("./static/texture/spec.jpeg");
        let earth_material = new THREE.MeshPhongMaterial({
            shininess: 40,
            bumpScale: 1,
            map: earth_texture,
            bumpMap: earth_bump,
            specularMap: earth_specular
        });

        this.earth = new THREE.Mesh(earth_geometry, earth_material);
        this.earth.name = 'earth'

        this.scene.add(this.earth);
        return this.earth
    }
    addCloud() {
        let cloud_texture = new THREE.TextureLoader().load('./static/texture/cloud.png');
        let cloud_geometry = new THREE.SphereGeometry(21, 32, 32);
        let cloud_material = new THREE.MeshBasicMaterial({
            map: cloud_texture,
            transparent: true,
            opacity: 0.8
        });
        this.cloud = new THREE.Mesh(cloud_geometry, cloud_material);
        this.cloud.name = 'cloud'
        this.scene.add(this.cloud);
        return this.cloud
    }
    addLight() {
        let dirlight = new THREE.DirectionalLight(0xffffff, 0.4)
        dirlight.position.x = -150
        dirlight.position.y = 150
        dirlight.position.z = 0
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.scene.add(dirlight)
    }
    addEvent() {
        let mouseDown = false
        let mouseX = 0
        let mouseY = 0

        function onMouseMove(evt) {
            if (!mouseDown) return;
            evt.preventDefault();
            var deltaX = evt.clientX - mouseX,
                deltaY = evt.clientY - mouseY;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
            this.rotateScene(deltaX, deltaY);
        }

        function onMouseDown(evt) {
            evt.preventDefault();
            this.autoRotate = false
            mouseDown = true;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
        }

        function onMouseUp(evt) {
            evt.preventDefault();
            this.autoRotate = true
            mouseDown = false;
        }

        function goToPlace(e) {
            // let timer = setTimeout(changeChapter, 1000)
            let checkAim = this.checkAim.bind(this)
            checkAim()

            function changeChapter() {
                let doc = document
                let film = doc.querySelector('.pass-film')
                film.style.display = 'block'
                setTimeout(function () {
                    film.style.display = "none"
                    // scence.style.display = 'block'
                }, 3000)

            }


        }

        // bindEvent('body', 'mouseup', onMouseUp.bind(this))
        // bindEvent('body', 'mousedown', onMouseDown.bind(this))
        // bindEvent('body', 'mousemove', onMouseMove.bind(this))
        bindEvent('.main-ctrl', 'click', _debounce(goToPlace.bind(this), 200))
        bindEvent('.rotate-ctrl', 'click', function (e) {
            e.stopPropagation()
            this.overrideRotate = !this.overrideRotate
        }.bind(this))
        // bindEvent('body', 'resize', onWindowResize.bind(this))
    }
    render() {
        requestAnimationFrame(this.render);
        TWEEN.update();
        if (this.autoRotate && this.overrideRotate) {
            // this.rotateScene()
            this.controls.update()
        }

        this.renderer.render(this.scene, this.camera);
    }
    rotateScene(deltaX, deltaY) {
        // this.rotateEarth(deltaX, deltaY)
        // this.rotateCloud(deltaX, deltaY)
        // this.rotateParticle(deltaX, deltaY)
        this.scene.rotation.y += 0.001
    }
    rotateEarth(deltaX = 1, deltaY = 0) {
        this.earth.rotation.y += deltaX / 1000;
        this.earth.rotation.x += deltaY / 1000;
    }
    rotateCloud(deltaX = 2, deltaY = 0) {
        this.cloud.rotation.y += deltaX / 1000;
        this.cloud.rotation.x += deltaY / 1000;
    }
    rotateParticle(deltaX = 1, deltaY = 0) {
        this.particles.rotation.y += deltaX / 1000
        this.particles.rotation.x += deltaY / 1000
    }
    addPoint(points) {
        let pointGeo = new THREE.Geometry()
        let sprite = new THREE.TextureLoader().load("./static/texture/sprite/i_galapagos.png");

        if (this._places || points) {
            let len = points.length
            let place = this._places || points
            for (let i = 0; i < len; i++) {
                let positon = this.getPosition(place[i].lng, place[i].lat, 30)
                let vertex = new THREE.Vector3(positon.x, positon.y, positon.z)
                pointGeo.vertices.push(vertex)
            }
        }
        // sprite.offset.set(-0.3,0)
        let material = new THREE.PointsMaterial({
            size: 30,
            sizeAttenuation: true,
            map: sprite,
            transparent: true,
            precision: "highp"
        });
        this.particles = new THREE.Points(pointGeo, material);
        // this.particles.
        // this.particles.scale.set(0.3, 0.3, 0.3)
        this.particles.name = 'coordinate'
        this.scene.add(this.particles);
    }
    checkAim() {
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var INTERSECTED
        mouse.x = Math.round(800 / 2) / 800 * 2 - 1
        mouse.y = -(Math.round(1600 / 2) / 1600) * 2 + 1
        raycaster.setFromCamera(mouse, this.camera);
        var earth = this.scene.getObjectByName('earth')
        var intersects = raycaster.intersectObjects([earth])
        if (intersects.length > 0) {
            this.addRay([new THREE.Vector3(0, -30, 60), intersects[0].point])
        }
        var res = this.particles.geometry.vertices //getVerWorldPos(this.particles)
        res.forEach(pos => {
            pos.distance = getDis(pos, intersects[0].point)
        })
        res.sort((a, b) => {
            return a.distance - b.distance
        })
        this.rotatePlaceToMid(res[0], intersects[0].point)



    }
    addRay(points = [new THREE.Vector3(-30, 39.8, 30), new THREE.Vector3(-30, 0, 0)]) {

        var second_earth = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 60, 0.1);
        var mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: false
        })
        this.second_earth = new THREE.Mesh(second_earth, mat)
        this.scene.add(this.second_earth)
    }
    getPosition(lng, lat, alt) {
        var phi = (90 - lat) * (Math.PI / 180),
            theta = (lng + 180) * (Math.PI / 180),
            radius = alt,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {
            x: x,
            y: y,
            z: z
        };
    }
    addHelper() {
        var axisHelper = new THREE.AxisHelper(100);
        this.scene.add(axisHelper);
    }
    rotatePlaceToMid(from, to) {
        //采用摄像机不动，只转动地球时候才使用的对准方法
        // let rs = this.rotateScene.bind(this)
        // let r = getDis(from, to)

        // var deltaX = Math.asin(from.y / r)
        // var deltaY = Math.asin((5.57001407161917 - from.x) / r)
        var initPos = this.controls.position0.clone()
        var offsetX = 5 //抵消顶点在贴图中央进行的X轴方向偏移
        var offsetZ = 0 //抵消顶点在贴图中央进行的z轴方向偏移
        var preX = 0
        var preY = 0
        var tween = new TWEEN.Tween({
            deltaX: initPos.x,
            deltaY: initPos.y
        })
        this.autoRotate = false //暂停摄像机自动滚动
        //使用applyAxisAngle接口可以对摄像机直接进行绕轴旋转计算
        tween.to({
            // x: (from.x + offsetX) * 5,
            // y: from.y * 5,
            // z: (from.z + offsetZ) * 5
            deltaX: 180,
            deltaY: -90
        }, 10000);
        tween.start()
        var __ctrl = this.controls
        tween.onUpdate(function (e) {
            //__ctrl.reset()
            rotateCam(this.deltaX, this.deltaY)

        });

        var rotateCam = (deltaX, deltaY) => {
            var base = initPos.clone()
            base.applyAxisAngle(
                (new THREE.Vector3(30, 0, 0)).normalize(),
                deltaY / 180 * Math.PI)
            base.applyAxisAngle(
                (new THREE.Vector3(0, 30, 0)).normalize(),
                deltaX / 180 * Math.PI)
            this
                .controls
                .position0 = base



            this.controls.reset()
        }
        // this.controls.position0 = new THREE.Vector3(,
        //     from.y * 5,

        // )
        // rs(deltaY * 1000, deltaX * 1000)
    }
    animation() {

    }




}

function _debounce(fn, wait) {
    var timer = null;
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn()
        }, wait)
    }
}

function _log() {
    console.log(1)
}

class App {

}

function init() {
    initStage()
}
init()


function initStage() {
    let stage = new render3D()

    stage.addEarth()
    stage.addLight()
    stage.addCloud()
    stage.addHelper()
    stage.addPoint([{
        lng: 113.257291,
        lat: 23.149415
    }, {
        lng: 116.427915,
        lat: 39.902895
    }])
    // stage.addRay()
    stage.addEvent()

    // stage.testGeo()
    stage.render()

}


function bindEvent(target, event, cb) {
    let doc = document
    doc.querySelector(target).addEventListener(event, cb)
}

/**
 * 获取顶点的世界坐标
 * 
 * @param {any} obj 
 * @returns 
 */
function getVerWorldPos(obj) {
    let geo = obj.geometry
    let vertices = []
    geo.vertices.forEach(vertice => {
        //要把节点数据复制出来，不然会使得每次变换矩阵的时候都是使用了上次的位置
        //而不是原始的位置
        // console.log(vertice.clone().applyMatrix4(obj.matrixWorld))
        vertices.push(vertice.clone().applyMatrix4(obj.matrixWorld))
    })
    return vertices
}


function getDis(a, b) {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2) +
        Math.pow(a.z - b.z, 2)
    )
}