import {ApiObject} from './api_object.js'

export class Board extends ApiObject {
  constructor(board_id, api_config, access_token) {
    super(api_config, access_token);
    this.board_id= board_id;
  }

  async get() {
    if (!this.board_id) {
      throw 'board_id must be set to get a board';
    }
    return this.request_data(`/v3/boards/${this.board_id}/`);
  }

  async get_pins() {
    return this.get_iterator(`/v3/boards/${this.board_id}/pins/`);
  }

  async get_sections() {
    return this.get_iterator(`/v3/board/${this.board_id}/sections/`);
  }

  async get_section_pins(section_id) {
    return this.get_iterator(`/v3/board/sections/${section_id}/pins/`);
  }

  static print_summary(board_data) {
    console.log('--- Board Summary ---');
    console.log('Board ID:', board_data.id);
    console.log('Name:', board_data.name);
    console.log('URL:', board_data.url);
    console.log('Category:', board_data.category);
    console.log('Description:', board_data.description);
    console.log('Pin Count:', board_data.pin_count);
    console.log('--------------------');
  }

  async create(board_data) {
    const OPTIONAL_ATTRIBUTES = [
      'category',
      'collaborator_invites_enabled',
      'description',
      'event_date',
      'event_start_date',
      'initial_pin_client_tracking_params',
      'initial_pins',
      'layout',
      'privacy',
      'protected',
      'return_existing'
    ];
    const create_data = {
      'name': board_data.name
    };
    for (const key in OPTIONAL_ATTRIBUTES) {
      const value = board_data[key];
      if (value) {
        create_data[key] = value;
      }
    }

    const new_board_data = await this.put_data('/v3/boards/', create_data);
    this.board_id = new_board_data.id;
    return new_board_data;
  }

  async delete() {
    return await this.delete_and_check(`/v3/boards/${this.board_id}/`);
  }

  static print_section(section_data) {
    console.log('--- Board Section ---');
    console.log(`Section ID: ${section_data.id}`);
    console.log(`Title: ${section_data.title}`);
    console.log(`Pin Count: ${section_data.pin_count}`);
    console.log('---------------------');
  }

  static print_sections(sections_iterator) {
    for (const section of sections_iterator) {
      this.print_section(section);
    }
  }

  async create_section(section_data) {
    const OPTIONAL_ATTRIBUTES = [
      'client_id',
      'initial_pins',
      'preselected_pins',
      'title_source'
    ];
    const create_data = {
      'title': section_data.title
    };
    for (const key in OPTIONAL_ATTRIBUTES) {
      const value = section_data[key];
      if (value) {
        create_data[key] = value;
      }
    }

    return this.put_data(`/v3/board/${this.board_id}/sections/`, create_data);
  }
}
