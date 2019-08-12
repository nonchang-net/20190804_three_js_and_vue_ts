/**
 * ThreeContext.ts
 * - THREE使い回すに当たってクラス間で共有する変数セット
 */


import * as THREE from 'three';
import Game from '@/Game';
import Loader from './Loader';

export default interface ThreeContext {
	scene?: THREE.Scene;
	game?: Game;
	loader?: Loader;
}
