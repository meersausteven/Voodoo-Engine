# 2D-Engine made in Vanilla JS | ©meersausteven

This engine is heavily inspired by the Unity3D game engine.
This is not supposed to be a copy of the Unity3D game engine, but rather to learn how game engines operate and need to work in order to properly function.

## History
The initial idea came from my first try of creating a simple top-down RPG. After struggling with the positioning and tweaking of several objects and their components I got fed up and thought 'this could use an editor'.
After the first couple versions of the editor I abandoned the idea to only use it for top-down RPGs, but rather for all kinds of 2D-games. So I started generalizing needed components and functions to fit all needs.

## Current functionalities
* Editor that provides a simple and easy to use UI
* Creation and modification of game objects
* Several components that can be added to and modified for game objects
* Own physics calculation engine
* Ability to test the current project using the built-in play mode
* Ability to import and export projects

## Current list of working components
* Transform (position and orientation)
* Camera
* Rigidbody (for physics calculation)
* Renderers:
 * Box Renderer
 * Circle Renderer
 * Text Renderer
 * Line Renderer

## Currently working on
* Components:
 * Image Renderer
 * Colliders:
  * Box Collider
  * Circle Collider
  * Line Collider
* Collision calculation
* Force calculation
* Raycasting
* Editor gizmos for different components

## Planned features
* Components:
 * Animation (change different settings from different components)
 * Script (create own behaviours for game objects)
* Sprite editor (directly edit and create sprites)
* Spritesheet editor
* Particle System
* Default script components for simple control schemes (jump'n'run, top-down, etc.)
