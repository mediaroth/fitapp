<?php

class ExerciseControllerTest extends TestCase {

  /**
   * A basic functional test example.
   *
   * @return void
   */
  public function testIndexRoute()
  {
    $crawler = $this->client->request('GET', '/exercise');

    $this->assertTrue($this->client->getResponse()->isOk());
  }

}