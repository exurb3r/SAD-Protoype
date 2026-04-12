import requests

BASE_URL = "http://localhost:3500/system"

token = None


def set_token(t):
    global token
    token = t


def get_headers():
    return {
        "Authorization": f"Bearer {token}"
    }


def login(email, password):

    try:

        res = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": email, "password": password}
        )

        data = res.json()

        if res.status_code == 200:

            set_token(data["token"])

            return True, data

        return False, data.get("message", "Login failed")

    except Exception as e:
        return False, str(e)


def get_members():

    try:

        res = requests.get(
            f"{BASE_URL}/members",
            headers=get_headers()
        )

        return res.json()

    except:
        return []


def get_member_details(user_id):

    try:

        res = requests.get(
            f"{BASE_URL}/members/{user_id}",
            headers=get_headers()
        )

        return res.json()

    except Exception as e:
        return {"error": str(e)}


def member_login(user_id, force_walkin=False):

    try:

        res = requests.post(
            f"{BASE_URL}/members/{user_id}/login",
            headers=get_headers(),
            json={"forceWalkIn": force_walkin}
        )

        return res.json()

    except Exception as e:
        return {"error": str(e)}


def member_logout(user_id):

    try:

        res = requests.post(
            f"{BASE_URL}/members/{user_id}/logout",
            headers=get_headers()
        )

        return res.json()

    except Exception as e:
        return {"error": str(e)}


def rfid_scan(rfid_code, force_walkin=False):
    try:
        res = requests.post(
            f"{BASE_URL}/members/rfid",
            headers=get_headers(),
            json={"rfid": rfid_code, "forceWalkIn": force_walkin}
        )
        return res.status_code, res.json()
    except Exception as e:
        return 500, {"error": str(e)}