import type { Express } from "express";
import { scenario01 } from "./scenarios/01_missing_server_check.js";
import { scenario02 } from "./scenarios/02_optional_token.js";
import { scenario03 } from "./scenarios/03_fail_open.js";
import { scenario04 } from "./scenarios/04_http_status_only.js";
import { scenario05 } from "./scenarios/05_score_ignored.js";
import { scenario06 } from "./scenarios/06_action_ignored.js";
import { scenario07 } from "./scenarios/07_hostname_ignored.js";
import { scenario08 } from "./scenarios/08_token_replay.js";
import { scenario09 } from "./scenarios/09_check_then_use_race.js";
import { scenario10 } from "./scenarios/10_client_verified_flag.js";
import { scenario11 } from "./scenarios/11_debug_bypass.js";
import { scenario12 } from "./scenarios/12_hardcoded_bypass.js";
import { scenario13 } from "./scenarios/13_feature_flag_default_off.js";
import { scenario14 } from "./scenarios/14_user_selected_provider.js";
import { scenario15 } from "./scenarios/15_truthy_type_confusion.js";
import { scenario16 } from "./scenarios/16_missing_await.js";
import { scenario17 } from "./scenarios/17_callback_result_ignored.js";
import { scenario18 } from "./scenarios/18_alternate_endpoint.js";
import { scenario19 } from "./scenarios/19_resend_gap.js";
import { scenario20 } from "./scenarios/20_proxy_header_trust.js";
import { scenario21 } from "./scenarios/21_client_state_cookie.js";
import { scenario22 } from "./scenarios/22_identity_normalization_gap.js";
import { scenario23 } from "./scenarios/23_method_gap.js";
import { scenario24 } from "./scenarios/24_mobile_api_bypass.js";
import { scenario25 } from "./scenarios/25_expiry_ignored.js";
import { scenario26 } from "./scenarios/26_otp_resend_gap.js";

export function registerVulnerableRoutes(app: Express) {
  [scenario01, scenario02, scenario03, scenario04, scenario05, scenario06,
   scenario07, scenario08, scenario09, scenario10, scenario11, scenario12,
   scenario13, scenario14, scenario15, scenario16, scenario17, scenario18,
   scenario19, scenario20, scenario21, scenario22, scenario23, scenario24,
   scenario25, scenario26].forEach(register => register(app));
}
