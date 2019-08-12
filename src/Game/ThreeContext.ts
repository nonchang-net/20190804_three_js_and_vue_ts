/**
 * ThreeContext.ts
 * - THREE使い回すに当たってクラス間で共有する変数セット
 */


import * as THREE from 'three';
import View from './View';
import Game from '@/Game';
import Loader from './Loader';

export default interface ThreeContext {
	scene?: THREE.Scene;
	view?: View;
	game?: Game;
	loader?: Loader;
}
