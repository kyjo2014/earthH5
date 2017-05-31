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
        this.renderer.setClearColor(0xffffff, 0)
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(800, 1600);
        this.renderer.render(this.scene, this.camera)
        this.addEvent()
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
        this.scene.add(this.earth);
    }
    addCloud() {
        let cloud_texture = new THREE.TextureLoader().load('./static/texture/cloud.png');
        let cloud_geometry = new THREE.SphereGeometry(21, 32, 32);
        let cloud_material = new THREE.MeshBasicMaterial({
            shininess: 10,
            map: cloud_texture,
            transparent: true,
            opacity: 0.8
        });
        this.cloud = new THREE.Mesh(cloud_geometry, cloud_material);
        this.scene.add(this.cloud);
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
        bindEvent('body', 'mousemove', this.onMouseMove.bind(this))
        bindEvent('body', 'resize', this.onWindowResize.bind(this))
    }
    render() {
        requestAnimationFrame(this.render);
        // stats.begin();

        this.rotateScene()
        // stats.end();
        this.renderer.render(this.scene, this.camera);
    }
    rotateScene() {
        this.earth.rotation.y += 0.005;
        this.cloud.rotation.y += 0.002;
        this.particles.rotation.y += 0.005;
    }
    rotateEarth(deg) {
        this.earth.rotation.y += deltaX / 300;
        this.earth.rotation.x += deltaY / 300;
    }
    rotateCloud(deg) {
        this.cloud.rotation.y += deltaX / 300;
        this.cloud.rotation.x += deltaY / 300;
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
        this.scene.add(this.particles);
    }
    checkAim() {

    }
    testGeo() {
        let testSphGeo = new THREE.SphereGeometry(33, 5, 5)
        let sprite = new THREE.TextureLoader().load("./static/texture/sprite/i_galapagos.png");
        let material = new THREE.PointsMaterial({
            size: 90,
            sizeAttenuation: false,
            map: sprite,
            alphaTest: 0.5,
            transparent: false
        });

        // material.color.setHSL(1.0, 0.3, 0.7);
        let particles = new THREE.Points(testSphGeo, material);
        console.log(testSphGeo.vertices)
        particles.scale.x = 0.6
        particles.scale.y = 0.6
        particles.scale.z = 0.6
        this.scene.add(particles);
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

    onWindowResize() {
        this.camera.aspect = 800 / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(800, window.innerHeight);
    }
    onMouseMove(e) {
        if (!mouseDown) return;
        e.preventDefault();
        var deltaX = e.clientX - mouseX,
            deltaY = e.clientY - mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        rotateScene(deltaX, deltaY);
    }



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
    stage.addPoint([{
        lng: 113.257291,
        lat: 23.149415
    }, {
        lng: 116.427915,
        lat: 39.902895
    }])
    // stage.testGeo()
    stage.render()

}


function bindEvent(target, event, cb) {
    let doc = document
    doc.querySelector(target).addEventListener(event, cb)
}