# Voodoo 2D Game-Engine in JavaScript | © Sven May

This engine is heavily inspired by different popular game engines like Unity3D and Unreal Engine.
This is not supposed to be a copy of these game engines, but rather to learn how such operate and need to work in order to properly function.
It works using an entity components system (ECS) in which GameObjects (Talismans) can be assigned Components (Enchantments) which fulfill different purposes.

## History
The initial idea came from my first try of creating a simple top-down RPG. After struggling with the positioning and tweaking of several objects and their components I got fed up and thought 'this could use an editor'.
After the first couple versions of the editor I abandoned the idea to only use it for top-down RPGs, but rather for all kinds of 2D-games. So I started generalizing needed components and functions to fit all needs.

## Current functionalities
* Editor with intuitive design and workflow in a magic theme
* Creation and modification of talismans
* Several enchantments that can be added and modified
* Fizzle - The integrated 2D physics calculation engine
* Ability to switch to the player for quick testing of the current project
* Ability to import and export projects

## List of existing enchantments
* Transform
* Ocular (camera)
* Rigidbody
* Renderers:
 * Box Renderer
 * Circle Renderer
 * Text Renderer
 * Line Renderer
* Colliders:
 * Box Collider
 * Circle Collider
 * Capsule Collider

## Planned enchantments
* Renderers:
 * Image Renderer
* Colliders:
 * Line Collider
 * Polygon Collider
* Animation
* Spell (write own scripts as new enchantments)
* Controllers:
 * Jump 'n Run Controller
 * Top Down Controller

## Planned features
* Sprite Editor
* Particle System
* Music Composer
* Shaders
