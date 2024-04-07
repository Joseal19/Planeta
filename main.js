import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';

// URLs das texturas
var q = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjExMjU4fQ&auto=format&fit=crop&w=827&q=80';
var e = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&auto=format&fit=crop&w=1033&q=80';
var p = 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';
var a = 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=696&q=80';

// Grupos de objetos
var s_group = new THREE.Group();
var s_galax = new THREE.Group();

function principal() {
    // Configuração inicial da cena, renderer e câmera
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(18);
    
	// Configurações da câmera
    camera.near = 1;
    camera.far = 2000;
    camera.position.z = -10;
    
	// Configurações do renderer
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
	// Controles de órbita
    const controles = new OrbitControls(camera, canvas);
    controles.target.set(0, 0, 0);
    controles.update();
    controles.enableZoom = false;
    
	// Adiciona neblina à cena
    cena.fog = new THREE.Fog(0x391809, 9, 15)
    cena.add(s_group);
    cena.add(s_galax);
    
	// Criação de luzes na cena
    function criarLuzes() {    
        const luzDirecional = new THREE.DirectionalLight( 0x333333, 4);
        
		luzDirecional.position.set( 5, 5, 5 );
        luzDirecional.lookAt( 0, 0, 0 );
        luzDirecional.castShadow = true;
        luzDirecional.shadow.mapSize.width = 512;  // padrão
        luzDirecional.shadow.mapSize.height = 512; // padrão
        luzDirecional.shadow.camera.near = 0.5;    // padrão
        luzDirecional.shadow.camera.far = 500;     // padrão
    
		// Adiciona as luzes à cena
        cena.add( luzDirecional );
    }
    
	// Carrega textura e retorna material
    function carregarMaterial(valor) {
        (valor == undefined) ? valor = a : valor = valor;
        const textura = new THREE.TextureLoader().load(valor);
        return textura;
    }
    
	// Carrega EnvMap (mapa de ambiente)
    function carregarEnvMap() {
        const t_envMap = new THREE.TextureLoader().load(a);
    
		t_envMap.mapping = THREE.EquirectangularReflectionMapping;
        t_envMap.magFilter = THREE.LinearFilter;
        t_envMap.minFilter = THREE.LinearMipmapLinearFilter;
        t_envMap.encoding = THREE.sRGBEncoding;
        return t_envMap;
    }
   
	// Criação de elementos na cena
    var c_mat, a_mes, b_mes, c_mes, d_mes;
    function criarElementos() {
        
		// Geometrias dos objetos
        const a_geo = new THREE.IcosahedronBufferGeometry(1,5);
        const b_geo = new THREE.TorusKnotBufferGeometry( 0.6, 0.25, 100, 15 );
        const c_geo = new THREE.TetrahedronGeometry(1, 3);
        const d_geo = new THREE.TorusGeometry(2, 0.4, 3, 60);
       
		// Material com várias texturas
        c_mat = new THREE.MeshStandardMaterial({
            envMap: carregarEnvMap(),
            map: carregarMaterial(e),
            aoMap: carregarMaterial(e),
            bumpMap: carregarMaterial(q),
            lightMap: carregarMaterial(p),
            emissiveMap: carregarMaterial(q),
            metalnessMap: carregarMaterial(e),
            displacementMap: carregarMaterial(p),
            flatShading: false,
            roughness: 0.0,
            emissive: 0x333333,
            metalness: 1.0,
            refractionRatio: 0.94,
            emissiveIntensity: 0.1,
            bumpScale: 0.01,
            aoMapIntensity: 0.0,
            displacementScale: 0.0
        });
        
		// Criação dos objetos com o material definido
        a_mes = new THREE.Mesh(a_geo, c_mat);
        b_mes = new THREE.Mesh(b_geo, c_mat);
        c_mes = new THREE.Mesh(c_geo, c_mat);
        d_mes = new THREE.Mesh(d_geo, c_mat);
        d_mes.name = 'd_mes_object';
       
		// Configuração de sombra e adição dos objetos ao grupo
        a_mes.castShadow = a_mes.receiveShadow = true;
        b_mes.castShadow = b_mes.receiveShadow = true;
        c_mes.castShadow = c_mes.receiveShadow = true;
        d_mes.castShadow = d_mes.receiveShadow = true;
        d_mes.rotation.x = -90 * Math.PI / 180;
        d_mes.scale.z = 0.02;
        a_mes.add(d_mes);
        s_group.add(a_mes);
        s_group.add(b_mes);
        s_group.add(c_mes);
        b_mes.visible = c_mes.visible = false;
    }
    // Cria pontos na cena
    function criarPontos(valor, tamanho) {
        const geometria = new THREE.BufferGeometry();
        const posicoes = [];
        const n = (tamanho) ? tamanho : 20, n2 = n / 2;

        for (let i = 0; i < ((valor) ? valor : 15000); i++) {
            const x = Math.random() * n - n2;
            const y = Math.random() * n - n2;
            const z = Math.random() * n - n2;
            posicoes.push(x, y, z);
        }
        geometria.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
        geometria.computeBoundingSphere();
       
		const material = new THREE.PointsMaterial({ size: 0.02});
        const pontos = new THREE.Points(geometria, material);
        
		s_galax.add(pontos);
    }
    
	// Função de animação
    function animacao() {
        requestAnimationFrame(animacao);
        let tempo = Date.now() * 0.003;
        s_group.rotation.y -= 0.001;
        s_group.rotation.x += 0.0005;
        s_galax.rotation.z += 0.001 / 4;
        s_galax.rotation.x += 0.0005 / 4;
        camera.lookAt(cena.position);
        camera.updateMatrixWorld();
        renderer.render(cena, camera);
    }
    
	// Função para redimensionar a janela
    function redimensionarJanela() {
        const largura = window.innerWidth;
        const altura = window.innerHeight;
        camera.aspect = largura / altura;
        camera.updateProjectionMatrix();
        renderer.setSize(largura, altura);
    }
    
	// Chamadas das funções e eventos
    criarElementos();
    criarPontos();
    criarLuzes();
    redimensionarJanela();
    animacao();
    window.addEventListener('resize', redimensionarJanela, false);
}

window.addEventListener('load', principal, false);
